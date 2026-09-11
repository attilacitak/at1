local M={}
function M.Choose(list,luck)
	luck=math.max(0,tonumber(luck) or 0)
	local total,weights=0,{}
	for i,v in ipairs(list) do
		local boost=1+luck*((i-1)/math.max(1,#list-1))*2.5
		weights[i]=(v.Weight or 1)*boost
		total+=weights[i]
	end
	local r=math.random()*total
	local c=0
	for i,v in ipairs(list) do
		c+=weights[i]
		if r<=c then return v end
	end
	return list[#list]
end
return M
