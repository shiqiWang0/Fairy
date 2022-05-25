// 通过脚手架创建模版项目
// module.exports =  (projectName) => {
//     console.log(`此处是文件${projectName}`);
// }

// 拉去模版项目
const axios = require('axios');
const inquirer = require('inquirer');
// const ora = require('ora');
// 1).获取仓库列表
const fetchReopLists = async () => {
    // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get('https://api.github.com/orgs/lxy-cli/repos');
    return data;
};

module.exports = async (projectName) => {
    let repos = await fetchReopLists();
    repos = repos.map((item) => item.name);
    console.log(`创建项目名称：${projectName}`);

    // 添加询问
    const { repo } = await inquirer.prompt([
        {
            type: 'list',
            name:'repo',
            message:'请选择一个你要创建的项目模版',
            choices: repos
        }
    ]);
    console.log(`已选项目模版： ${repo}`);
    // const spinner = ora('Loading 测试中哈哈哈。。。').start();
    // setTimeout(() => {
    //     spinner.color = 'red';
    //     spinner.text = 'Loading ora哈哈哈';
    //     // 成功
    //     spinner.succeed('拉取成功');
    // }, 1000);
};




