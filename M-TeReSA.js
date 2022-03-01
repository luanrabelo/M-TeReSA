const fs        = require('fs');
const https     = require('https');
const { exit }  = require('process');
const { exec }  = require('child_process');
const Args  = process.argv.slice(2);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create Folder
function CreateFolder(FolderName) {
    const Folder    = FolderName;
    const NewFolder = Folder.replace(/,/g, "").replace(/\./g, "");
    if (!fs.existsSync(NewFolder)) {
        console.log('\x1b[33m%s\x1b[0m', `Creating Folder: (${NewFolder})`);
        fs.mkdirSync(NewFolder);
        console.log('\x1b[32m%s\x1b[0m', `The Folder: (${NewFolder}) has been successfully created!`);
    }
}
// Download XML NCBI
function DownloadXML(Voucher) {
    CreateFolder("Genomes");
    const url = "https://www.ncbi.nlm.nih.gov/sviewer/viewer.cgi?tool=portal&save=file&log$=seqview&db=nuccore&report=gbc_xml&id="+Voucher+"&conwithfeat=on&withparts=on&hide-cdd=on";
    https.get(url, (res) => {
        const file = fs.createWriteStream(`Genomes/${Voucher}.xml`);
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('\x1b[32m%s\x1b[0m', `The Genome (${Voucher}) -> has been successfully obtained!`);
            console.log('\x1b[46m%s\x1b[0m', "Reading data...");
            await = ReadXML(Voucher);
        });
    }).on("error", (err) => {
        console.log("Error: ", err.message);
        exit();
    });
}

// Download Region Control
function ReadXML(Voucher) {
    fs.readFile(`Genomes/${Voucher}.xml`, function (err, xml) {
    if (err) {
    console.log('\x1b[31m%s\x1b[0m', `Read Genome File: (${Voucher}) -> Fail`);
        } else {
        FileXML = xml.toString();
        FeatureTag  = FileXML.substring(FileXML.indexOf("<INSDFeature_key>D-loop</INSDFeature_key>"), 
        FileXML.lastIndexOf("<INSDFeature_intervals>"));
        StartEnd = FeatureTag.replace("<INSDFeature_key>D-loop</INSDFeature_key>", "");
        StartEnd = StartEnd.replace("<INSDFeature_location>", "");
        StartEnd = StartEnd.replace("</INSDFeature_location>", "");
        StartEnd = StartEnd.replace(/ /g, "");
        StartEnd = StartEnd.split("..");
        console.log('\x1b[32m%s\x1b[0m', `Read Genome File: (${Voucher}) -> Success`);
        await = DownloadFasta(Voucher, StartEnd[0], StartEnd[1]);
}});}
// Download Fasta 
function DownloadFasta(Voucher, From, End) {
    CreateFolder("ControlRegion");
    const url = "https://www.ncbi.nlm.nih.gov/sviewer/viewer.cgi?tool=portal&save=file&log$=seqview&db=nuccore&report=fasta&id="+Voucher+"&from="+From+"&to="+End+"&extrafeat=null&conwithfeat=on&hide-cdd=on";
    https.get(url, (res) => {
        const file = fs.createWriteStream(`${Voucher}.fasta`);
        await = res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('\x1b[32m%s\x1b[0m', `The Control Region File (${Voucher}) -> has been successfully obtained!`);
            console.log('\x1b[33m%s\x1b[0m', `Running TFR (${Voucher})`);
            await = RunTFR(Voucher);
        });
    }).on("error", (err) => {
        console.log("Error: ", err.message);
        exit();
    });
}
// Run TFR
function RunTFR(Voucher) {
    CreateFolder("Results");
    var opsys = process.platform;
    if (opsys == "darwin") {
      exec('trf409.macosx '+Voucher+'.fasta 2 5 7 80 10 50 2000 -l 6');
    } else if (opsys == "win32"){
      exec('trf409.dos32.exe '+Voucher+'.fasta 2 5 7 80 10 50 2000 -l 6');
    } else if (opsys == "win64") {
      exec('trf409.dos64.exe '+Voucher+'.fasta 2 5 7 80 10 50 2000 -l 6');
      opsys = "Windows";  
    } else if (opsys == "linux") {
      exec('trf409.legacylinux64 '+Voucher+'.fasta 2 5 7 80 10 50 2000 -l 6');
    }
    
    console.log('\x1b[46m%s\x1b[0m', "Analysing data, please wait...")
    wait(3000).then(() => {
        MoveFastaFile(Voucher);
        MoveResultFile(Voucher);
        MoveResultTxt(Voucher);
    }).catch(() => {
    console.log(`Error move file ${Voucher}!`);
    });
    wait(10000).then(() => {
        OutPutFile(Voucher);
        }).catch(() => {
        console.log(`Error move file ${Voucher}!`);
        });
}
// Output File HTML
function OutPutFile(Voucher){
    Main = '\n<tr>\n'+
    '<td><a class="btn btn-lg btn-primary w-100" href="https://www.ncbi.nlm.nih.gov/nuccore/'+Voucher+'" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i> '+Voucher+'</a></td>\n'+
    '<td><a class="btn btn-lg btn-primary w-100" href="https://www.ncbi.nlm.nih.gov/nuccore/'+Voucher+'" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i><i class="text-left"> '+Organism(Voucher)+'</i></a></td>\n'+
    '<td><button type="button" class="btn btn-lg btn-info w-100">'+LengthGenome(Voucher)+'</button></td>\n'+
    '<td><button type="button" class="btn btn-lg btn-info w-100">'+LengthRC(Voucher)+'</button></td>\n'+
    '<td>'+Fasta(Voucher)+'</td>\n'+
    '<td><a class="btn btn-lg btn-primary w-100" href="Results/'+Voucher+'.fasta.2.5.7.80.10.50.2000.1.html" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i> '+Repeats(Voucher)+'</a></td>\n'+
    '<td>'+Indice(Voucher)+'</td>\n'+
    '<td>'+CopyN(Voucher)+'</td>\n'+
    '<td>'+PSize(Voucher)+'</td>\n'+
    '<td>'+CopyN(Voucher)+'</td>\n'+
    '</tr>\n';
    await = fs.writeFileSync('M-TeReSA_Results.html', Main, {encoding: "utf8", flag: 'a+'});
    console.log('\x1b[32m%s\x1b[0m', `Result TFR (${Voucher}) add to M-TeReSA_Results.html`);
}

// Move Fasta File to ControlRegion
function MoveFastaFile(Voucher) {
    fs.rename(Voucher+".fasta", "ControlRegion/"+Voucher+".fasta", function (err) {
    if (err)
        throw err;
        console.log('\x1b[32m%s\x1b[0m', 'Control Region Sequence in ControlRegion Folder');
    });
}

function MoveResultFile(Voucher) {
    fs.rename(Voucher+".fasta.2.5.7.80.10.50.2000.1.html", "Results/"+Voucher+".fasta.2.5.7.80.10.50.2000.1.html", function (err) {
    if (err)
    throw err;
    console.log('\x1b[32m%s\x1b[0m', 'TFR Result in Results Folder');
    });
}
function MoveResultTxt(Voucher) {
    fs.rename(Voucher+".fasta.2.5.7.80.10.50.2000.1.txt.html", "Results/"+Voucher+".fasta.2.5.7.80.10.50.2000.1.txt.html", function (err) {
    if (err)
    throw err;
    console.log('\x1b[32m%s\x1b[0m', 'TFR Result in Results Folder');
    });
  }


function LengthRC(Voucher) {
    const { convert } = require('html-to-text');
    try {
      const FileHTML = fs.readFileSync("Results/"+Voucher+".fasta.2.5.7.80.10.50.2000.1.html", 'utf8');
      const text = convert(FileHTML, {
        wordwrap: 130
      });
      Table = [];
      List = text.split("\n");
      List.forEach(function (value) {
        TextList = value.replace("\n", "").replace("\r", "");
  
        if (TextList.includes("Length: ") == true) {
          const search = ' ';
          const replacer = new RegExp(search, 'g');
          Lengthdloop = TextList.replace("Length:", "").replace(replacer, "");
        }
      });
      return Lengthdloop;
    } catch (err) {
      console.error(err);
    }
  }
  
// Organism Name
function Organism(Voucher) {
  xml = fs.readFileSync(`Genomes/${Voucher}.xml`);
  FileXML = xml.toString();
  FeatureTag  = FileXML.substring(FileXML.indexOf("_organism"), 
  FileXML.lastIndexOf("_organism"));
  Specie = FeatureTag.replace("_organism>","").replace("</INSDSeq", "");
  return Specie;
}
// Length Genome
function LengthGenome(Voucher) {
  xml = fs.readFileSync(`Genomes/${Voucher}.xml`);
  FileXML = xml.toString();
  FeatureTag  = FileXML.substring(FileXML.indexOf("_length"), 
  FileXML.lastIndexOf("_length"));
  Length = FeatureTag.replace("_length>","").replace("</INSDSeq", "");
  return Length;
}  
// Link Fasta File  
function Fasta(Voucher) {
    Link = `<a class="btn btn-lg btn-primary w-100" href="ControlRegion/${Voucher}.fasta" download="ControlRegion_${Voucher}.fasta" type="text/plain" target="_blank" role="button"><i class="fa-solid fa-download"></i> Download</a>`;
    return Link;
}
    
  
  function Repeats(Voucher) {
    const { convert } = require('html-to-text');
    const search = ' ';
    const replacer = new RegExp(search, 'g');
  
    try {
      const FileHTML = fs.readFileSync("Results/"+Voucher+".fasta.2.5.7.80.10.50.2000.1.html", 'utf8');
      const text = convert(FileHTML, {
        wordwrap: 130
      });
      Table = [];
      List = text.split("\n");
      List.forEach(function (value) {
        TextList = value.replace("\n", "").replace("\r", "");
  
        if (TextList.includes("This is table  1  of  1") == true) {
          Repeatsd = TextList.replace("This is table  1  of  1", "").replace("repeats found", "").replace(replacer, "").replace("(", "").replace(")", "");
          Table.push(Repeatsd);
        }
      });
      return Table;
    } catch (err) {
      console.error(err);
    }
  }
  
  
  
function Indice(Voucher) {
  const { convert } = require('html-to-text');
  const search = ' ';
  const replacer = new RegExp(search, 'g');

  try {
    const FileHTML = fs.readFileSync("Results/" + Voucher + ".fasta.2.5.7.80.10.50.2000.1.html", 'utf8');
    const text = convert(FileHTML, {wordwrap: 130});
    Table = [];
    List = text.split("\n");
    List.forEach(function (value) {
      TextList = value.replace("\n", "").replace("\r", "");
      if (TextList.includes(".txt.html") == true) {
        matches = TextList.match(/\[.+?\]/g).toString().split("#");
        indice = matches[1].split(",");
        Table.push('<a class="btn btn-lg btn-primary mb-2 w-100" href="Results/'+Voucher+'.fasta.2.5.7.80.10.50.2000.1.txt.html#'+indice[0]+'" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i> '+indice[0]+"</a><br>");
      }
    });
    return Table.toString().replace(/,/g, "");
  } catch (err) {
    console.error(err);
  }
}
  
const PSize = (Voucher) => {
  const { convert } = require('html-to-text');
  const search = ' ';
  const replacer = new RegExp(search, 'g');
  try {
    const FileHTML = fs.readFileSync("Results/"+Voucher+".fasta.2.5.7.80.10.50.2000.1.html", 'utf8');
    const text = convert(FileHTML, {wordwrap: 130});
    TableS = [];
    List = text.split("\n");
    List.forEach(function(value){
    TextList = value.replace("\n", "").replace("\r", "");
      
  if (TextList.includes(".txt.html") == true) {
    matches = TextList.match(/\[.+?\]/g).toString().split("#");
    indice = matches[1].split(",");
    TableS.push('<button type="button" class="btn btn-lg btn-info w-100 mb-2">'+indice[2].toString()+'</button><br>');   
  }});
  return TableS.toString().replace(/,/g, ""); 
  } catch (err) {
    console.error(err)
  }}
  
  const CopyN = (Voucher) => {
    const { convert } = require('html-to-text');
    const search = ' ';
    const replacer = new RegExp(search, 'g');
  
  try {
    const FileHTML = fs.readFileSync("Results/"+Voucher+".fasta.2.5.7.80.10.50.2000.1.html", 'utf8');
    const text = convert(FileHTML, {
    wordwrap: 130
    });
    Table = [];
    List = text.split("\n");
    List.forEach(function(value){
    TextList = value.replace("\n", "").replace("\r", "");
      
  if (TextList.includes(".txt.html") == true) {
    matches = TextList.match(/\[.+?\]/g).toString().split("#");
    indice = matches[1].split(",");
    Table.push('<button type="button" class="btn btn-lg btn-info w-100 mb-2">'+indice[3].toString()+'</button><br>'); 
    
  }
  });
  return Table.toString().replace(/,/g, ""); 
  } catch (err) {
    console.error(err)
  }}


const data = fs.readFileSync(Args[0], {encoding:'utf8', flag:'r'});

console.log("M-TeReSA v-1.0");
console.log("Please wait...");
HTMLHead = '<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>M-TeReSA</title>\n'+
  '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>\n'+
  '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">\n'+
  '<script src="https://kit.fontawesome.com/7d94912b47.js" crossorigin="anonymous"></script>\n'+
  '<script src="https://code.jquery.com/jquery-3.6.0.js"></script>\n'+
  '<script src="https://cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>\n'+
  '<style>\n'+
	'td {\n'+
	'vertical-align: middle;\n'+
	'}\n'+	
  '</style>\n'+
  '</head>\n<body class="bg-black font-monospace text-center">\n'+
  '<div class="h1 text-center text-white mt-5 mb-5">M-TeReSA - v 1.0.0</div>\n'+
  '<div class="text-center h5 text-white">Gomes et al. (2022)</div>\n'+
  '<div class="mx-auto w-75"><button id="ExcelExport" type="button" class="btn btn-block btn-lg btn-primary mb-3 mt-3 w-100"><i class="fa-solid fa-file-excel"></i> Export Excel File</button></div>\n'+
  '<table id="Table" class="table table-dark table-striped table-hover text-center table-bordered">\n<tbody>\n'+
    '\n<tr>\n'+
    '<td class="h3">Accession</td>\n'+
    '<td class="h3">Organism</td>\n'+
    '<td class="h3">Len. Genome (bp)</td>\n'+
    '<td class="h3">Len. CR (bp)</td>\n'+
    '<td class="h3">Download Fasta (CR)</td>\n'+
    '<td class="h3">Repeats</td>\n'+
    '<td class="h3">Indices</td>\n'+
    '<td class="h3">Period Size</td>\n'+
    '<td class="h3">Copy Number</td>\n'+
    '<td class="h3">Consensus Size</td>\n'+
    '</tr>\n';
    fs.writeFileSync('M-TeReSA_Results.html', HTMLHead, {encoding: "utf8", flag: 'a+'});

var List = data.split("\r\n");
List.forEach(function(value){
     DownloadXML(value);
});


HTMLFooter = 
'</tbody>\n</table>\n'+'<script>\n'+
'$(document).ready(function(){\n'+
'$("#ExcelExport").click(function() {\n'+
'var preserveColors = ($("#Table").hasClass("table2excel_with_colors") ? true : false);\n'+
'$("#Table").table2excel({\n'+
'name: "M-TeReSA",\n'+
'filename: "M-TeReSA.xls",\n'+
'fileext: ".xls",\n'+
'exclude_img: true, exclude_links: true, exclude_inputs: true, preserveColors: preserveColors\n'+
'});});});\n</script>\n'+'</body>\n</html>';
wait(15000).then(() => {
  await = fs.writeFileSync('M-TeReSA_Results.html', HTMLFooter, {encoding: "utf8", flag: 'a+'});
}).catch(() => {
});
