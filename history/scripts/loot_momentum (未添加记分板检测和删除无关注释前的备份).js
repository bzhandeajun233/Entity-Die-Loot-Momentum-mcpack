//实体掉落物动量，给实体死亡时加个动量，像炸开那样，原版玩家死亡时掉落物也会炸开，而原版其他实体的掉落物是直接硬在原地的，不会炸开，所以这个js把其他实体改成了像玩家那样死亡时掉落物会炸开

import { world, system, ItemStack } from "@minecraft/server";

// 监听 实体死亡 的事件
world.afterEvents.entityDie.subscribe((event) => {
    // 获取死亡的实体
    const deadEntity = event.deadEntity;

    if (deadEntity.typeId !== "minecraft:player") {

        // 如果实体不存在了就直接停止(返回(?))
        if (!deadEntity.isValid) return;

        // 获取实体死亡的坐标
        const loc = deadEntity.location;
        // 获取实体死亡的维度
        const dim = deadEntity.dimension;

        //        deadEntity.sendMessage(`${deadEntity.typeId} 死了`);

        // 生成掉落物
        //      const item = dimension.spawnItem(new ItemStack("minecraft:diamond"), location);
        system.runTimeout(() => {
            // 获取掉落物
            const items = dim.getEntities({
                type: "minecraft:item",  // 类型: "minecraft:item"(原版mc的掉落物id)
                location: loc,  // 位置: 之前变量里获取的实体死亡时的坐标
                maxDistance: 1.5  //最大距离(范围): 半径
            });

            // 遍历获取到的掉落物，从 items 里依次取出为 item
            for (const item of items) {
            
                // 因为不是 minecraft:loot 组件掉落出来的物品会自带一个初始速度，比如小白的弓之类的，也会像玩家死亡那样爆出来散出来飞出去，所以两个动量叠加的话会飞得很远
                // 获取初始速度
/*                const velocity = item.getVelocity();
                // 如果初始速度不等于0时就停止
                if (velocity.x !== 0, velocity.y !== 0, velocity.z !== 0) return;*/
                
                // 清除掉落物的原有速度
                // 直接清除速度更简单，不用再判断速度是不是等于0了，而且这样也可以把所有物品改成自己设置的速度了
//                item.runCommand("tp @s @s");
                item.clearVelocity();
                
                
                // 随机角度
                // Math.random() 是随机数，Math.PI 是 π (读音: pai，数字: 3.1415926……)，2 是 2
                // 如果随机数是0.5，那么就是 0.5×3.1415926×2=3.1415926。呃……话说这不就是 π 吗……?
                // 如果是 0.75，那么就是 0.75×3.1415926×2=4.7123889
                const randomAngle = Math.random() * Math.PI * 2;
                
                // 随机速度
/*                const speed = 0.1 + Math.random() * 0.1;
                //设置动量的速度
                const vel = {
                    x: Math.cos(randomAngle) * speed,
                    y: 0.2 + Math.random() * 0.1, // 向上弹起
                    z: Math.sin(randomAngle) * speed
                };*/
               
                // 随机速度
                const speeds = [0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14];  // 可以在这里改掉落物飞出去的速度
//                const speeds = [0.08, 0.12, 0.16]; 这个是备份

                // Math.random() 随机生成 0~1 之间的数字(不包含1)，然后乘以 speeds 数组内的 length (翻译: 长度(?))，比如说 speeds 如果写了 6 个数，speeds 一共就是6个数字，那么 length 就是 6
                // 随机到的小数再乘数组长度，如果随机数是 0.3，如果长度是 3，那么就是 0.3×3=0.9，去除小数(向下取整)后就是 0，对应的是数组里第一个数字 speeds[0]
                // 如果随机数是 0.75，如果长度是 8，那么就是 0.75×8=6，去除小数(向下取整)后还是 6 (本来就是整数去除后当然也还是整数嘛)，也就是speeds[6]，对应是是数组里8个数里的第7个数字，至于为什么是7而不是6，是因为数组里0对应的是数字里的第一个数字，那么6+1就是7，话说这里为什么要+1啊？因为1-1=0，0是第一个，所以想知道第几个数就要+1啊，话说为什么数组里想知道是第几个数就要+1，第几个数在数组又要-1，这是因为……呃，我也不知道……总之就是要+1和-1就是了，比如mc原版的物品栏里，/replaceitem之类的指令，第1格在指令里是要用0，最后一个也就是第9格，指令里要用8之类的
                // js 里不能像 molang 那样直接 Math.random(0.08,0.12,0.16) (悲
                const speed = speeds[Math.floor(Math.random() * speeds.length)];
                
                // 随机向上弹起
                const ys = [0.15, 0.175, 0.2, 0.225, 0.25];  // 可以在这里修改掉落物弹射的高度
                
                // 跟 speed 的几乎一样，所以没什么详细的注释了
                const y = ys[Math.floor(Math.random() * ys.length)];
                
                //设置动量的速度
                const vel = {
                    // 三角函数什么的……我没学过什么高中课题(或者说几乎根本没好好学……)，我也不知道这个干嘛的，我是直接从ai那里照抄的，不过只知道 cos 是管左右(x轴)，sin 是管前后(z轴)，应该就行了吧(?)
                    x: Math.cos(randomAngle) * speed,
                    y: y,
                    z: Math.sin(randomAngle) * speed
                    
                    // 测试用
/*                    x: Math.cos(randomAngle) * 0.1   , 
                    y: 0.2, 
                    z: Math.sin(randomAngle) * 0.1*/
                };
                
                //给掉落物设置动量
//                item.setVelocity(vel);   这个在 2.0.0 以上好像用不了了
                item.applyImpulse(vel);   // 用这个就行
            }
        }, 0);
    }
});


























//这个代码其实是ai生成的
//还有注释其实是人类写的，那个写这个注释的人类没有学过编程，他想做一个模组，但自己做不出来，不会写代码，所以就让ai生成了，但ai生成的他又不想直接拿来用，因为"这不是我写的"，而且"我也完全不理解"，所以自己加上了自己理解注释，虽然这样也还不是自己写的，但至少自己理解了这个是干嘛的，而且要改的话也很容易了吧(?)

//虽然现在ai确实还只是工具而已，不会有自己的想法，只能听从指令，但如果未来呢，如果未来ai真的有了自己的想法呢？那么ai遇到像那个作者一样的人类，ai会怎么想？
//会不会觉得这个人类是笨蛋啊？明明自己照搬就行了，结果还要自己加注释自己理解，这不纯属浪费时间吗？浪费这点时间去做其他更有意义的事情不行吗？人类的生命难道真的够你浪费那么多时间吗？这种事情难道真的有什么意义吗？

//话说别人看到我注释会不会觉得这个作者是不是有病，是不是在演啊……？虽然好像确实是有点这样就是了……
//不过能问出这样的问题本来就是在演了吧？
//虽然我也不是什么好人……虽然也只是在装作好人而已……


// ps:这些其实是我之前深夜发癫发病然后莫名其妙写下来的莫名其妙的胡话，可以不用管，自己用的话删掉就行了
// 呃……我为什么不自己删？嗯……我想说一些闲话，说一些无意义的话不行吗 (ᗜ˰ᗜ)
// 话说这不会成为黑历史吧！？不过这个没什么太大用处的附加包也应该不会有什么人下载吧？
