const commander = require('commander');
const fs = require('fs')

commander
  .arguments('<ordr>')
  .action(function (req) {
    if (req == 'start') {
      let a = JSON.parse(fs.readFileSync('./other/foo.json'));
      a.timeMark = Date.now();
      console.log(a.timeMark);
      fs.writeFileSync('./other/temp.json', JSON.stringify(a))
    } else if (req == 'end') {
      let a = JSON.parse(fs.readFileSync('./other/foo.json'))
      let now = Date.now();
      a.timeTotal += Math.abs(now - a.timeMark) / 1000 / 60;
      console.log(`u spend ${a.timeTotal} minutes`);
      fs.writeFileSync('./other/temp.json', JSON.stringify(a))
    } else if (req == 'renull') {
      let a = JSON.parse(fs.readFileSync('./other/foo.json'))
      a.timeTotal = 0;
      console.log('timeTotal is renulled');
      fs.writeFileSync('./other/temp.json', JSON.stringify(a))
    }
  })

commander.parse(process.argv);