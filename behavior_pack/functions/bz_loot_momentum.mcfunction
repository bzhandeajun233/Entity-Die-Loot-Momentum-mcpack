# 如果没有分数就创建记分板
execute unless score "掉落物动量" "bz_loot_momentum" matches -114514..114514 run scoreboard objectives add "bz_loot_momentum" dummy "掉落物动量附加包用的记分板"
# 给虚拟玩家"掉落物动量"加0分
scoreboard players add "掉落物动量" "bz_loot_momentum" 0

# 给所有掉落物实体加1分
scoreboard players add @e[type=minecraft:item] "bz_loot_momentum" 1
