const program = require('commander');
const path = require('path')
const { version } = require('./utils/constants.ts');
const { mapActions } = require('./utils/common.ts');
const { green, blue, yellow, red } = require('./utils/color.ts')

Reflect.ownKeys(mapActions).forEach((action) => {
       program.command(action) //配置命令的名字
              .alias(mapActions[action].alias) // 命令的别名
              .description(mapActions[action].description) // 命令对应的描述
              .action(() => {  //动作
                     if (action === '*') {  //访问不到对应的命令 就打印找不到命令
                            console.log(mapActions[action].description);
                     } else {
                            green('👽 👽 👽 ' + '欢迎使用fairy-cli,轻松构建react ts项目～🎉🎉🎉')
                            // 分解命令 到文件里 有多少文件 就有多少配置 create config
                            // fairy-cli create project-name ->[node,fairy-cli,create,project-name]
                            require(path.join(__dirname, `${String(action)}.ts`))(...process.argv.slice(3));
                     }
              })
});

// 监听用户的help事件
program.on('--help', () => {
       console.log('\nExamples:');
       Reflect.ownKeys(mapActions).forEach((action) => {
              mapActions[action].examples.forEach((example) => {
                     console.log(` ${example}`);
              })
       })
})

program.version(version)
       .parse(process.argv); // process.argv就是用户在命令行中传入的参数