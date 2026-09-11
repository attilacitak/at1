local Players=game:GetService("Players")
local RS=game:GetService("ReplicatedStorage")
local DSS=game:GetService("DataStoreService")
local Config=require(RS.Modules.GameConfig)
local Weighted=require(RS.Modules.WeightedRandom)

local Remotes=RS:FindFirstChild("DumpsterRemotes") or Instance.new("Folder")
Remotes.Name="DumpsterRemotes"; Remotes.Parent=RS
local function remote(name)
	local r=Remotes:FindFirstChild(name) or Instance.new("RemoteEvent")
	r.Name=name; r.Parent=Remotes; return r
end
local StateUpdated=remote("StateUpdated")
local Toast=remote("Toast")
local HatchRequest=remote("HatchRequest")
local HatchResult=remote("HatchResult")
local EquipBestRequest=remote("EquipBestRequest")
local RequestState=remote("RequestState")

local Store=DSS:GetDataStore(Config.DataStoreName)
local Data,LastDive={},{}

local function newData()
	return {Cash=0,Trash={},TrashCount=0,Eggs={},Pets={},EquippedPets={},UnlockedTier=1,InventoryCapacity=Config.InventoryCapacity,TotalDives=0}
end
local function clean(d)
	if type(d)~="table" then return newData() end
	local n=newData()
	for k in pairs(n) do if d[k]~=nil then n[k]=d[k] end end
	n.Cash=math.max(0,tonumber(n.Cash) or 0)
	n.UnlockedTier=math.clamp(tonumber(n.UnlockedTier) or 1,1,#Config.Dumpsters)
	n.InventoryCapacity=math.max(Config.InventoryCapacity,tonumber(n.InventoryCapacity) or Config.InventoryCapacity)
	return n
end
local function bonuses(d)
	local sell,luck=1,0
	for _,name in ipairs(d.EquippedPets) do
		local p=Config.Pets[name]
		if p then sell+=(p.Sell or 1)-1; luck+=p.Luck or 0 end
	end
	return sell,luck
end
local function snapshot(d)
	local trash,eggs,pets={},{},{}
	for name,v in pairs(d.Trash) do table.insert(trash,{Name=name,Count=v.Count,Value=v.Value}) end
	for name,count in pairs(d.Eggs) do table.insert(eggs,{Name=name,Count=count}) end
	for name,count in pairs(d.Pets) do table.insert(pets,{Name=name,Count=count}) end
	return {Cash=d.Cash,TrashCount=d.TrashCount,InventoryCapacity=d.InventoryCapacity,Trash=trash,Eggs=eggs,Pets=pets,EquippedPets=d.EquippedPets,UnlockedTier=d.UnlockedTier,TotalDives=d.TotalDives}
end
local function push(plr) if Data[plr] then StateUpdated:FireClient(plr,snapshot(Data[plr])) end end
local function save(plr)
	local d=Data[plr]; if not d then return end
	local ok,err=pcall(function() Store:SetAsync("p_"..plr.UserId,d) end)
	if not ok then warn("Save failed",plr.Name,err) end
end
local function load(plr)
	local d
	local ok,err=pcall(function() d=Store:GetAsync("p_"..plr.UserId) end)
	if not ok then warn("Load failed",plr.Name,err) end
	Data[plr]=clean(d); push(plr)
end
local function unlock(d)
	while d.UnlockedTier<#Config.Dumpsters do
		local n=d.UnlockedTier+1
		if d.Cash>=Config.Dumpsters[n].UnlockCash then d.UnlockedTier=n else break end
	end
end
local function addTrash(d,item)
	if d.TrashCount>=d.InventoryCapacity then return false end
	local slot=d.Trash[item.Name] or {Count=0,Value=item.Value}
	slot.Count+=1; slot.Value=item.Value; d.Trash[item.Name]=slot; d.TrashCount+=1
	return true
end
local function dive(plr,tier)
	local d,cfg=Data[plr],Config.Dumpsters[tier]
	if not d or not cfg then return end
	if tier>d.UnlockedTier then Toast:FireClient(plr,("Locked! Need $%d for %s."):format(cfg.UnlockCash,cfg.Name)); return end
	if d.TrashCount>=d.InventoryCapacity then Toast:FireClient(plr,"Bag full! Sell your trash first."); return end
	local now=os.clock(); if now-(LastDive[plr] or 0)<cfg.Cooldown then return end; LastDive[plr]=now
	local _,luck=bonuses(d)
	if math.random()<cfg.EggChance*(1+luck) then
		local egg=cfg.EggPool[math.random(1,#cfg.EggPool)]
		d.Eggs[egg]=(d.Eggs[egg] or 0)+1; d.TotalDives+=1
		Toast:FireClient(plr,"🥚 You found a "..egg.."!"); push(plr); return
	end
	local item=Weighted.Choose(cfg.Loot,luck)
	if addTrash(d,item) then d.TotalDives+=1; Toast:FireClient(plr,("Found %s! $%d value"):format(item.Name,item.Value)) end
	push(plr)
end
local function sell(plr)
	local d=Data[plr]; if not d or d.TrashCount<=0 then return end
	local base=0
	for _,v in pairs(d.Trash) do base+=(v.Count or 0)*(v.Value or 0) end
	local mult=bonuses(d); local payout=math.floor(base*mult)
	d.Cash+=payout; d.Trash={}; d.TrashCount=0; unlock(d)
	Toast:FireClient(plr,("Sold trash for $%d!"):format(payout)); push(plr)
end
local function hatch(plr,eggName)
	local d,pool=Data[plr],Config.Eggs[eggName]
	if not d or not pool or (d.Eggs[eggName] or 0)<=0 then return end
	d.Eggs[eggName]-=1; if d.Eggs[eggName]<=0 then d.Eggs[eggName]=nil end
	local _,luck=bonuses(d); local pet=Weighted.Choose(pool,luck*.5).Name
	d.Pets[pet]=(d.Pets[pet] or 0)+1
	if #d.EquippedPets<Config.MaxEquippedPets then table.insert(d.EquippedPets,pet) end
	HatchResult:FireClient(plr,eggName,pet); push(plr)
end
local function petScore(name)
	local p=Config.Pets[name]; if not p then return 0 end
	return ((p.Sell or 1)-1)*100+(p.Luck or 0)*100
end
local function equipBest(plr)
	local d=Data[plr]; if not d then return end
	local all={}
	for name,count in pairs(d.Pets) do for _=1,count do table.insert(all,name) end end
	table.sort(all,function(a,b) return petScore(a)>petScore(b) end)
	d.EquippedPets={}; for i=1,math.min(Config.MaxEquippedPets,#all) do table.insert(d.EquippedPets,all[i]) end
	Toast:FireClient(plr,"Equipped best pets!"); push(plr)
end

local function billboard(part,text)
	local g=Instance.new("BillboardGui"); g.Size=UDim2.fromOffset(260,72); g.StudsOffset=Vector3.new(0,4.4,0); g.AlwaysOnTop=true; g.Parent=part
	local t=Instance.new("TextLabel"); t.Size=UDim2.fromScale(1,1); t.BackgroundTransparency=1; t.Text=text; t.TextScaled=true; t.Font=Enum.Font.GothamBlack; t.TextColor3=Color3.new(1,1,1); t.TextStrokeTransparency=.35; t.Parent=g
end
local function makeDumpster(parent,tier,pos)
	local cfg=Config.Dumpsters[tier]
	local model=Instance.new("Model"); model.Name="Dumpster_Tier_"..tier; model.Parent=parent
	local body=Instance.new("Part"); body.Name="Body"; body.Size=Vector3.new(7,4.5,5); body.Position=pos; body.Anchored=true; body.Material=Enum.Material.Metal; body.Color=cfg.Color; body.Parent=model
	local lid=Instance.new("Part"); lid.Name="Lid"; lid.Size=Vector3.new(7.2,.45,5.2); lid.Position=pos+Vector3.new(0,2.55,-.4); lid.Orientation=Vector3.new(-12,0,0); lid.Anchored=true; lid.Material=Enum.Material.Metal; lid.Color=cfg.Color:Lerp(Color3.new(0,0,0),.15); lid.Parent=model
	billboard(body,("TIER %d\n%s"):format(tier,cfg.Name))
	local p=Instance.new("ProximityPrompt"); p.ActionText="DIVE"; p.ObjectText=cfg.Name; p.KeyboardKeyCode=Enum.KeyCode.E; p.HoldDuration=cfg.DiveTime; p.MaxActivationDistance=10; p.RequiresLineOfSight=false; p.Parent=body
	p.Triggered:Connect(function(plr) dive(plr,tier) end)
end
local function makeWorld()
	local folder=workspace:FindFirstChild("Dumpsters") or Instance.new("Folder"); folder.Name="Dumpsters"; folder.Parent=workspace
	if #folder:GetChildren()==0 then for tier=1,#Config.Dumpsters do makeDumpster(folder,tier,Vector3.new((tier-1)*12,3,0)) end end
	local sellPad=workspace:FindFirstChild("SellTrashZone")
	if not sellPad then
		sellPad=Instance.new("Part"); sellPad.Name="SellTrashZone"; sellPad.Size=Vector3.new(14,.6,14); sellPad.Position=Vector3.new(28,.3,18); sellPad.Anchored=true; sellPad.Material=Enum.Material.Neon; sellPad.Color=Color3.fromRGB(55,225,110); sellPad.Parent=workspace
		billboard(sellPad,"SELL TRASH")
		local debounce={}
		sellPad.Touched:Connect(function(hit)
			local plr=Players:GetPlayerFromCharacter(hit.Parent); if not plr or debounce[plr] then return end
			debounce[plr]=true; sell(plr); task.delay(1,function() debounce[plr]=nil end)
		end)
	end
	if not workspace:FindFirstChildOfClass("SpawnLocation") then local sp=Instance.new("SpawnLocation"); sp.Size=Vector3.new(10,1,10); sp.Position=Vector3.new(-10,.5,18); sp.Anchored=true; sp.Neutral=true; sp.Parent=workspace end
	if not workspace:FindFirstChild("Baseplate") then local b=Instance.new("Part"); b.Name="Baseplate"; b.Size=Vector3.new(100,1,60); b.Position=Vector3.new(25,-.5,8); b.Anchored=true; b.Material=Enum.Material.Concrete; b.Color=Color3.fromRGB(65,65,70); b.Parent=workspace end
end

HatchRequest.OnServerEvent:Connect(hatch)
EquipBestRequest.OnServerEvent:Connect(equipBest)
RequestState.OnServerEvent:Connect(function(plr) push(plr) end)
Players.PlayerAdded:Connect(load)
Players.PlayerRemoving:Connect(function(plr) save(plr); Data[plr]=nil; LastDive[plr]=nil end)
game:BindToClose(function() for _,plr in ipairs(Players:GetPlayers()) do save(plr) end end)
task.spawn(function() while true do task.wait(Config.AutoSaveSeconds); for _,plr in ipairs(Players:GetPlayers()) do save(plr) end end end)
makeWorld()
for _,plr in ipairs(Players:GetPlayers()) do task.spawn(load,plr) end
