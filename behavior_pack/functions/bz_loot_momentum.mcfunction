# 如果没有分数就创建记分板
execute unless score "掉落物动量" "bz_loot_momentum" matches -114514..114514 run scoreboard objectives add "bz_loot_momentum" dummy "掉落物动量附加包用的记分板"
# 如果没有分数那么就给虚拟玩家"掉落物动量"设置为1分
execute unless score "掉落物动量" "bz_loot_momentum" matches -114514..114514 run scoreboard players set "掉落物动量" "bz_loot_momentum" 1

# 给所有掉落物实体加1分
scoreboard players add @e[type=minecraft:item] "bz_loot_momentum" 1
