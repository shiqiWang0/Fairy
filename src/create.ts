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
const GithubApi = {
    repos: 'https://api.github.com/users/shiqiWang0/repos',
}

// 1).获取仓库列表
const fetchReopLists = async () => {
    const { data } = await axios.get(GithubApi.repos);
    return data;
};

// 2). 创建之前，需要判断是否是相同目录且重名项目
const isProjectExist = async (proName, options) => {
    const cwd = process.cwd();
    if (!proName) return false;
    const targetAir = path.join(cwd, proName);
    if (options === 'force') {
        await fs.remove(targetAir);
    }
    let isExist = await fs.existsSync(targetAir);
    return isExist;
}

// 3). 创建项目- 配置前提
const createProTemp = async (proName) => {
    const { projectName } = defaultConfig;
    let repos = await fetchReopLists();
    repos = repos.map((item) => item.name);
    // 询问项目名称： 没有就默认 myFairy
    inquirer.prompt([
        {
            type: 'input', //type： input, number, confirm, list, checkbox ... 
            name: 'name', // key 名
            message: `项目名称 默认${proName || projectName}`, // 提示信息
            default: proName || projectName, // 默认值,
        },{
            type: 'input',
            name: 'author',
            message: '您的名字:',
            choices: repos,
        },{
            type: 'list',
            name: 'repo',
            message: '请选择一个你要创建的项目模版',
            choices: repos,
        }
    ]).then(answer => {
        console.log('create: answer', answer)
        const spinner = ora(yellow('Loading ...')).start();
        /* 创建文件 */
        create(answer)
        spinner.succeed('拉取成功');
    })
}

// 4） 创建项目
const create = (answer) => {
        /* 创建文件 */
        green('------开始构建-------')
        /* 找到template文件夹下的模版项目 */
        const sourcePath = __dirname.slice(0,-3)+'template'
        blue('当前路径:'+ process.cwd()+', sourcePath' + sourcePath)
        /* 修改package.json*/
        revisePackageJson( answer ,sourcePath ).then(()=>{
            console.log('packages.json 完成修改')
            // copy( sourcePath , process.cwd() ,npm() )
        })
}
function revisePackageJson(res,sourcePath){
    return new Promise((resolve)=>{
      /* 读取文件 */
        fs.readFile(sourcePath+'/package.json',(err,data)=>{
            if(err) throw err
            const { author , name  } = res
            let json = data.toString()
            /* 替换模版 */
            json = json.replace(/demoName/g,name.trim())
            json = json.replace(/demoAuthor/g,author.trim())
            const path = process.cwd()+'/template'+ '/package.json'
            /* 写入文件 */
            fs.writeFile(path, new Buffer(json) ,()=>{
                green( '创建文件：'+ path )
                resolve(null);
            })
        })
    })
}

module.exports = async (proName, options) => {
    green('👽 👽 👽 ' + '欢迎使用fairy-cli,轻松构建react ts项目～🎉🎉🎉')
    let isExist = await isProjectExist(proName, options);
    if (!isExist) {
        createProTemp(proName);
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
        // todo 覆盖原有项目；
        red('覆盖原有项目，并开始拉取！')
    } else {
        // todo 提示项目重名，并且重新创建新的项目名
        red('项目名称已经存在，请重新创建项目！')

    }
};



