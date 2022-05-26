// 通过脚手架创建模版项目

const axios = require('axios');
const inquirer = require('inquirer');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');

const { yellow, green, red, blue } = require('./utils/color.ts');

const defaultConfig = {
    projectName: 'myFairy'
}

// 1).获取仓库列表
const fetchReopLists = async () => {
    // 获取当前组织中的所有仓库信息,这个仓库中存放的都是项目模板
    const { data } = await axios.get('https://api.github.com/orgs/lxy-cli/repos');
    return data;
};

// 2). 创建之前，需要判断是否是相同目录且重名项目
const isProjectExist = async (proName, options) => {
    const cwd = process.cwd();
    const targetAir = path.join(cwd, proName);
    if (options === 'force') {
        await fs.remove(targetAir);
    }
    let isExist = await fs.existsSync(targetAir);
    return isExist;
}

// 3). 创建项目
const createProTemp = async (proName, options) => {
    const { projectName } = defaultConfig;
    let repos = await fetchReopLists();
    repos = repos.map((item) => item.name);
    // 询问项目名称： 没有就默认 myFairy
    const { name } = await inquirer.prompt([
        {
            type: 'input', //type： input, number, confirm, list, checkbox ... 
            name: 'name', // key 名
            message: `项目名称 默认${proName || projectName}`, // 提示信息
            default: proName || projectName// 默认值
        }
    ])
    blue(`项目名称： ${name}`)

    // 询问采用模版类型：
    const { repo } = await inquirer.prompt([
        {
            type: 'list',
            name: 'repo',
            message: '请选择一个你要创建的项目模版',
            choices: repos
        }
    ]);
    blue(`已选项目模版： ${repo}`);
    const spinner = ora(yellow('Loading ...')).start();
    setTimeout(() => {
        // 成功
        spinner.succeed('拉取成功');
    }, 1000);
}

module.exports = async (proName, options) => {
    green('👽 👽 👽 ' + '欢迎使用fairy-cli,轻松构建react ts项目～🎉🎉🎉')
    let isExist = await isProjectExist(proName, options);
    if (!isExist) {
        createProTemp(proName, options);
        return;
    }
    // 添加询问： 是否覆盖原路径
    const { overWrite } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'overWrite',
            message: '是否覆盖原项目:',
            default: false
        }
    ]);
    blue(`overWrite: ${overWrite}`);
    if (overWrite) {
        // 覆盖原有项目；
        red('覆盖原有项目，并开始拉取！')
    } else {
        // 提示项目重名，并且重新创建新的项目名
        red('项目名称已经存在，请重新创建项目！')

    }
};



