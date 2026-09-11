local Players=game:GetService("Players")
local RS=game:GetService("ReplicatedStorage")
local TweenService=game:GetService("TweenService")

local player=Players.LocalPlayer
local R=RS:WaitForChild("DumpsterRemotes")
local StateUpdated=R:WaitForChild("StateUpdated")
local Toast=R:WaitForChild("Toast")
local HatchRequest=R:WaitForChild("HatchRequest")
local HatchResult=R:WaitForChild("HatchResult")
local EquipBestRequest=R:WaitForChild("EquipBestRequest")
local RequestState=R:WaitForChild("RequestState")

local state={Cash=0,TrashCount=0,InventoryCapacity=40,Eggs={},Pets={},EquippedPets={},UnlockedTier=1,TotalDives=0}
local gui=Instance.new("ScreenGui"); gui.Name="DumpsterHUD"; gui.ResetOnSpawn=false; gui.Parent=player:WaitForChild("PlayerGui")
local function corner(x,r) local c=Instance.new("UICorner"); c.CornerRadius=UDim.new(0,r or 12); c.Parent=x end
local function stroke(x) local s=Instance.new("UIStroke"); s.Color=Color3.new(1,1,1); s.Transparency=.7; s.Parent=x end

local top=Instance.new("Frame"); top.Size=UDim2.fromOffset(310,100); top.Position=UDim2.fromOffset(18,18); top.BackgroundColor3=Color3.fromRGB(23,26,34); top.BackgroundTransparency=.08; top.Parent=gui; corner(top,16); stroke(top)
local title=Instance.new("TextLabel"); title.Size=UDim2.new(1,-20,0,28); title.Position=UDim2.fromOffset(10,8); title.BackgroundTransparency=1; title.Text="🗑️ DUMPSTER DIVER"; title.Font=Enum.Font.GothamBlack; title.TextSize=20; title.TextColor3=Color3.new(1,1,1); title.TextXAlignment=Enum.TextXAlignment.Left; title.Parent=top
local cash=title:Clone(); cash.Size=UDim2.new(.5,-10,0,24); cash.Position=UDim2.fromOffset(10,42); cash.Font=Enum.Font.GothamBold; cash.TextSize=18; cash.TextColor3=Color3.fromRGB(80,235,125); cash.Parent=top
local bag=cash:Clone(); bag.Position=UDim2.new(.5,0,0,42); bag.TextColor3=Color3.fromRGB(245,210,90); bag.Parent=top
local tier=cash:Clone(); tier.Size=UDim2.new(1,-20,0,20); tier.Position=UDim2.fromOffset(10,70); tier.TextColor3=Color3.fromRGB(175,195,255); tier.TextSize=14; tier.Parent=top

local function mkButton(text,pos,color)
	local b=Instance.new("TextButton"); b.Size=UDim2.fromOffset(150,48); b.Position=pos; b.BackgroundColor3=color; b.Text=text; b.Font=Enum.Font.GothamBlack; b.TextColor3=Color3.new(1,1,1); b.TextSize=17; b.Parent=gui; corner(b,14); stroke(b); return b
end
local eggsBtn=mkButton("🥚 EGGS",UDim2.new(1,-168,0,20),Color3.fromRGB(115,75,210))
local petsBtn=mkButton("🐾 PETS",UDim2.new(1,-168,0,78),Color3.fromRGB(45,145,190))

local panel=Instance.new("Frame"); panel.Size=UDim2.fromOffset(430,430); panel.Position=UDim2.new(.5,-215,.5,-215); panel.BackgroundColor3=Color3.fromRGB(22,24,31); panel.Visible=false; panel.Parent=gui; corner(panel,18); stroke(panel)
local panelTitle=title:Clone(); panelTitle.Size=UDim2.new(1,-65,0,48); panelTitle.Position=UDim2.fromOffset(16,7); panelTitle.TextSize=22; panelTitle.Parent=panel
local close=Instance.new("TextButton"); close.Size=UDim2.fromOffset(40,40); close.Position=UDim2.new(1,-50,0,10); close.BackgroundColor3=Color3.fromRGB(60,65,78); close.Text="×"; close.Font=Enum.Font.GothamBlack; close.TextColor3=Color3.new(1,1,1); close.TextSize=26; close.Parent=panel; corner(close,10)
local list=Instance.new("ScrollingFrame"); list.Size=UDim2.new(1,-28,1,-78); list.Position=UDim2.fromOffset(14,62); list.BackgroundTransparency=1; list.BorderSizePixel=0; list.ScrollBarThickness=6; list.AutomaticCanvasSize=Enum.AutomaticSize.Y; list.CanvasSize=UDim2.new(); list.Parent=panel
local layout=Instance.new("UIListLayout"); layout.Padding=UDim.new(0,8); layout.Parent=list

local toast=Instance.new("TextLabel"); toast.Size=UDim2.fromOffset(500,54); toast.Position=UDim2.new(.5,-250,1,-78); toast.BackgroundColor3=Color3.fromRGB(20,22,28); toast.BackgroundTransparency=.08; toast.Font=Enum.Font.GothamBlack; toast.TextColor3=Color3.new(1,1,1); toast.TextSize=18; toast.Visible=false; toast.Parent=gui; corner(toast,14); stroke(toast)
local hatch=Instance.new("TextLabel"); hatch.Size=UDim2.fromOffset(620,180); hatch.Position=UDim2.new(.5,-310,.5,-90); hatch.BackgroundColor3=Color3.fromRGB(40,30,55); hatch.Font=Enum.Font.GothamBlack; hatch.TextColor3=Color3.new(1,1,1); hatch.TextSize=30; hatch.TextWrapped=true; hatch.Visible=false; hatch.Parent=gui; corner(hatch,22); stroke(hatch)

local function fmt(n)
	n=tonumber(n) or 0
	if n>=1e9 then return string.format("%.1fB",n/1e9) end
	if n>=1e6 then return string.format("%.1fM",n/1e6) end
	if n>=1e3 then return string.format("%.1fK",n/1e3) end
	return tostring(math.floor(n))
end
local function hud()
	cash.Text="$"..fmt(state.Cash)
	bag.Text=("👜 %d/%d"):format(state.TrashCount,state.InventoryCapacity)
	tier.Text=("Best Tier: %d   •   Dives: %d"):format(state.UnlockedTier,state.TotalDives)
end

local toastId=0
local function showToast(msg)
	toastId+=1; local id=toastId; toast.Text=tostring(msg); toast.Visible=true; toast.TextTransparency=0; toast.BackgroundTransparency=.08
	task.delay(2.3,function()
		if id~=toastId then return end
		local tw=TweenService:Create(toast,TweenInfo.new(.3),{TextTransparency=1,BackgroundTransparency=1}); tw:Play(); tw.Completed:Wait()
		if id==toastId then toast.Visible=false end
	end)
end
local function clearList() for _,v in ipairs(list:GetChildren()) do if not v:IsA("UIListLayout") then v:Destroy() end end end
local function row(name,sub,action,fn)
	local f=Instance.new("Frame"); f.Size=UDim2.new(1,-4,0,68); f.BackgroundColor3=Color3.fromRGB(35,38,48); f.Parent=list; corner(f,12)
	local a=Instance.new("TextLabel"); a.Size=UDim2.new(1,-130,0,27); a.Position=UDim2.fromOffset(12,8); a.BackgroundTransparency=1; a.Text=name; a.Font=Enum.Font.GothamBold; a.TextSize=16; a.TextColor3=Color3.new(1,1,1); a.TextXAlignment=Enum.TextXAlignment.Left; a.Parent=f
	local b=a:Clone(); b.Position=UDim2.fromOffset(12,35); b.Size=UDim2.new(1,-130,0,21); b.Text=sub; b.Font=Enum.Font.Gotham; b.TextSize=13; b.TextColor3=Color3.fromRGB(185,190,205); b.Parent=f
	if action then
		local c=Instance.new("TextButton"); c.Size=UDim2.fromOffset(105,42); c.Position=UDim2.new(1,-117,.5,-21); c.BackgroundColor3=Color3.fromRGB(100,75,210); c.Text=action; c.Font=Enum.Font.GothamBlack; c.TextColor3=Color3.new(1,1,1); c.TextSize=13; c.Parent=f; corner(c,10); c.Activated:Connect(fn)
	end
end

local current
local function showEggs()
	current="eggs"; panel.Visible=true; panelTitle.Text="🥚 EGGS"; clearList()
	if #state.Eggs==0 then row("No eggs yet","Keep diving — eggs are rare finds!"); return end
	for _,e in ipairs(state.Eggs) do local name=e.Name; row(name,("Owned: %d"):format(e.Count),"HATCH",function() HatchRequest:FireServer(name) end) end
end
local function showPets()
	current="pets"; panel.Visible=true; panelTitle.Text="🐾 PETS"; clearList()
	row("Equipped",#state.EquippedPets>0 and table.concat(state.EquippedPets,", ") or "No pets equipped","BEST",function() EquipBestRequest:FireServer() end)
	if #state.Pets==0 then row("No pets yet","Hatch eggs to collect bonus pets."); return end
	for _,p in ipairs(state.Pets) do row(p.Name,("Owned: %d"):format(p.Count)) end
end

eggsBtn.Activated:Connect(showEggs)
petsBtn.Activated:Connect(showPets)
close.Activated:Connect(function() panel.Visible=false end)
StateUpdated.OnClientEvent:Connect(function(s)
	state=s; hud()
	if panel.Visible then if current=="eggs" then showEggs() else showPets() end end
end)
Toast.OnClientEvent:Connect(showToast)
HatchResult.OnClientEvent:Connect(function(egg,pet)
	hatch.Text=("🥚 %s\n\nYOU HATCHED\n🐾 %s!"):format(egg,pet); hatch.Visible=true; hatch.Size=UDim2.fromOffset(470,120); hatch.Position=UDim2.new(.5,-235,.5,-60)
	TweenService:Create(hatch,TweenInfo.new(.35,Enum.EasingStyle.Back,Enum.EasingDirection.Out),{Size=UDim2.fromOffset(620,180),Position=UDim2.new(.5,-310,.5,-90)}):Play()
	task.delay(2.2,function() hatch.Visible=false end)
end)

hud()
RequestState:FireServer()
