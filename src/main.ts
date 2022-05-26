const program = require('commander');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const { version } = require('./utils/constants.ts');
const { mapActions } = require('./utils/common.ts');
const { green, blue, yellow, red } = require('./utils/color.ts')

Reflect.ownKeys(mapActions).forEach((action) => {
       program.command(action) //配置命令的名字
              .alias(mapActions[action].alias) // 命令的别名
              .description(mapActions[action].description) // 命令对应的描述
              .option('-f, --force', 'overwrite target directory if it exist') // 是否强制创建，当文件夹已经存在
              .action(() => {  //动作
                     if (action === '*') {  //访问不到对应的命令 就打印找不到命令
                            console.log(mapActions[action].description);
                     } else{
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
       console.log('\r\n' + figlet.textSync('Fairy Cli', {
              font: 'Big',
              horizontalLayout: 'default',
              verticalLayout: 'default',
              whitespaceBreak: true
            }));
       console.log(`\r\nRun ${chalk.cyan(`fr <command> --help`)} for detailed usage of given command\r\n`)
})

program.version(version)
       .parse(process.argv); // process.argv就是用户在命令行中传入的参数