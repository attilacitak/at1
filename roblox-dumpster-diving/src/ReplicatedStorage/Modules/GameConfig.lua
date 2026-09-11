local Config = {}

Config.DataStoreName = "DumpsterDivingSimulator_V1"
Config.InventoryCapacity = 40
Config.MaxEquippedPets = 3
Config.AutoSaveSeconds = 60

Config.Dumpsters = {
	[1]={Name="Street Can",Color=Color3.fromRGB(90,90,90),UnlockCash=0,DiveTime=1.0,Cooldown=1.1,EggChance=.02,EggPool={"Cardboard Egg"},Loot={
		{Name="Crushed Can",Weight=35,Value=2},{Name="Newspaper",Weight=30,Value=3},{Name="Banana Peel",Weight=20,Value=2},{Name="Bottle",Weight=13,Value=4},{Name="Lost Coin",Weight=2,Value=20}}},
	[2]={Name="Apartment Dumpster",Color=Color3.fromRGB(55,130,75),UnlockCash=250,DiveTime=1.1,Cooldown=1.2,EggChance=.03,EggPool={"Cardboard Egg","Plastic Egg"},Loot={
		{Name="Pizza Box",Weight=30,Value=5},{Name="Old Shoe",Weight=26,Value=7},{Name="Broken Toy",Weight=22,Value=9},{Name="Bent Spoon",Weight=16,Value=12},{Name="Phone Case",Weight=6,Value=25}}},
	[3]={Name="Restaurant Dumpster",Color=Color3.fromRGB(65,100,170),UnlockCash=1500,DiveTime=1.2,Cooldown=1.3,EggChance=.04,EggPool={"Plastic Egg","Dumpster Egg"},Loot={
		{Name="Takeout Box",Weight=31,Value=14},{Name="Metal Pan",Weight=25,Value=20},{Name="Kitchen Gadget",Weight=21,Value=28},{Name="Unopened Snack",Weight=16,Value=38},{Name="Chef Tool",Weight=7,Value=60}}},
	[4]={Name="Mall Compactor",Color=Color3.fromRGB(135,70,185),UnlockCash=9000,DiveTime=1.3,Cooldown=1.4,EggChance=.055,EggPool={"Dumpster Egg","Neon Egg"},Loot={
		{Name="Store Display",Weight=28,Value=45},{Name="Returned Headphones",Weight=25,Value=60},{Name="Designer Box",Weight=22,Value=75},{Name="Broken Smartwatch",Weight=17,Value=110},{Name="Gift Card",Weight=8,Value=190}}},
	[5]={Name="Luxury Dumpster",Color=Color3.fromRGB(220,175,50),UnlockCash=50000,DiveTime=1.4,Cooldown=1.5,EggChance=.075,EggPool={"Neon Egg","Golden Egg"},Loot={
		{Name="Perfume Bottle",Weight=28,Value=125},{Name="Fancy Handbag",Weight=24,Value=170},{Name="Tablet Screen",Weight=21,Value=230},{Name="Watch Parts",Weight=17,Value=325},{Name="Gold Chain",Weight=10,Value=675}}},
	[6]={Name="Radioactive Dumpster",Color=Color3.fromRGB(75,235,90),UnlockCash=250000,DiveTime=1.5,Cooldown=1.6,EggChance=.10,EggPool={"Golden Egg","Mutant Egg"},Loot={
		{Name="Glowing Scrap",Weight=30,Value=450},{Name="Alien Circuit",Weight=25,Value=625},{Name="Mutated Toy",Weight=21,Value=875},{Name="Strange Crystal",Weight=16,Value=1300},{Name="UFO Part",Weight=8,Value=2700}}},
}

Config.Eggs = {
	["Cardboard Egg"]={{Name="Trash Rat",Weight=55},{Name="Dumpster Pigeon",Weight=35},{Name="Raccoon",Weight=10}},
	["Plastic Egg"]={{Name="Bottle Bug",Weight=50},{Name="Sewer Cat",Weight=35},{Name="Scrap Fox",Weight=15}},
	["Dumpster Egg"]={{Name="Dumpster Dog",Weight=48},{Name="Grease Goblin",Weight=34},{Name="Trash Panda",Weight=18}},
	["Neon Egg"]={{Name="Neon Rat",Weight=48},{Name="Glitch Pigeon",Weight=34},{Name="Cyber Raccoon",Weight=18}},
	["Golden Egg"]={{Name="Golden Raccoon",Weight=55},{Name="Diamond Rat",Weight=32},{Name="Royal Trash Panda",Weight=13}},
	["Mutant Egg"]={{Name="Mutant Rat",Weight=55},{Name="Toxic Raccoon",Weight=32},{Name="Alien Trash Beast",Weight=13}},
}

Config.Pets = {
	["Trash Rat"]={Sell=1.08,Luck=.02},["Dumpster Pigeon"]={Sell=1.10,Luck=.03},["Raccoon"]={Sell=1.18,Luck=.05},
	["Bottle Bug"]={Sell=1.15,Luck=.04},["Sewer Cat"]={Sell=1.20,Luck=.05},["Scrap Fox"]={Sell=1.28,Luck=.07},
	["Dumpster Dog"]={Sell=1.25,Luck=.06},["Grease Goblin"]={Sell=1.33,Luck=.08},["Trash Panda"]={Sell=1.45,Luck=.10},
	["Neon Rat"]={Sell=1.40,Luck=.09},["Glitch Pigeon"]={Sell=1.52,Luck=.12},["Cyber Raccoon"]={Sell=1.70,Luck=.15},
	["Golden Raccoon"]={Sell=1.75,Luck=.14},["Diamond Rat"]={Sell=2.00,Luck=.18},["Royal Trash Panda"]={Sell=2.40,Luck=.22},
	["Mutant Rat"]={Sell=2.10,Luck=.20},["Toxic Raccoon"]={Sell=2.55,Luck=.25},["Alien Trash Beast"]={Sell=3.20,Luck=.35},
}

return Config
