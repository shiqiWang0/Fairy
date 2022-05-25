// 通过脚手架创建模版项目
// module.exports =  (projectName) => {
//     console.log(`此处是文件${projectName}`);
// }

// 拉去模版项目
const axios = require('axios');
const inquirer = require('inquirer');
const ora = require('ora');
const { yellow } = require('./utils/color.ts');
const defaultConfig = {
    projectName: 'myFairy'
}
// 1).获取仓库列表
const fetchReopLists = async () => {
    // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get('https://api.github.com/orgs/lxy-cli/repos');
    return data;
};

module.exports = async (proName) => {
    const {projectName} = defaultConfig
    let repos = await fetchReopLists();
    repos = repos.map((item) => item.name);
    // 询问项目名称： 没有就默认 myFairy
    const { name } = await inquirer.prompt([
        {
            type: 'input', //type： input, number, confirm, list, checkbox ... 
            name: 'name', // key 名
            message: `项目名称 默认${proName || projectName }`, // 提示信息
            default: proName || projectName// 默认值
        }
    ])
    console.log(`项目名称： ${name}`)

    // 询问采用模版类型：
    const { repo } = await inquirer.prompt([
        {
            type: 'list',
            name: 'repo',
            message: '请选择一个你要创建的项目模版',
            choices: repos
        }
    ]);
    console.log(`已选项目模版： ${repo}`);
    const spinner = ora('Loading...').start();
    setTimeout(() => {
        yellow('Loading ora哈哈哈')
        // 成功
        spinner.succeed('拉取成功');
    }, 1000);
};




