const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')
const root = process.cwd()

// let   arguments = defaultValue()
// checkArguments()

init(root)


// script from: https://stackoverflow.com/questions/31773546/the-best-way-to-run-npm-install-for-nested-folders

function performCommand(folder) {
  let   arguments = defaultValue()

  // console.log(folder)
  const hasPackageJson = fs.existsSync(path.join(folder, 'Dockerfile'))

  if (hasPackageJson && folder !== root) {
    const command = `docker build -t  ${arguments.dockerUser}/${path.relative(root, folder)}:${arguments.version} .`
    console.log('===================================================================')
    console.log(`Performing -> ${command}`)
    console.log('===================================================================')

    yarnInstall(folder, command)
  }

}

// Performs `yarn`
function yarnInstall(where, command) {
  childProcess.execSync(command, { cwd: where, env: process.env, stdio: 'inherit' })
}

// Lists subfolders in a folder
function subfolders(folder) {
  const folders = fs.readdirSync(folder)
    .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder))

  // console.log(folders)
  return folders
}

function init(folder) {
  console.log(folder)

  // Recurse into subfolders
  for (let subfolder of subfolders(folder)) {
    performCommand(subfolder)
  }
}


function checkArguments() {
  const length = process.argv.length
  // console.log(process.argv);
  // console.log(process.argv.length)
  // process.argv.slice(2)

  if (length  === 4) {
    //  set default values
    console.log( 'new arguments')
    arguments.dockerUser = process.argv[2]
    arguments.version = process.argv[3]
  }
  if (length > 4) {
    throw new Error('params required are docekr user and image version')

  }

  console.log('docker options ->', arguments)
}

function defaultValue () {

  return {
    dockerUser: 'guerrerocristian',
    version: 'development'
  }
}