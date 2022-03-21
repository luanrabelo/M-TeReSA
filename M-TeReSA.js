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
            ReadXML(Voucher);
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
        DownloadFasta(Voucher, StartEnd[0], StartEnd[1]);
}});}
// Download Fasta 
function DownloadFasta(Voucher, From, End) {
    CreateFolder("ControlRegion");
    const url = "https://www.ncbi.nlm.nih.gov/sviewer/viewer.cgi?tool=portal&save=file&log$=seqview&db=nuccore&report=fasta&id="+Voucher+"&from="+From+"&to="+End+"&extrafeat=null&conwithfeat=on&hide-cdd=on";
    https.get(url, (res) => {
        const file = fs.createWriteStream(`${Voucher}.fasta`);
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('\x1b[32m%s\x1b[0m', `The Control Region File (${Voucher}) -> has been successfully obtained!`);
            console.log('\x1b[33m%s\x1b[0m', `Running TFR (${Voucher})`);
            RunTFR(Voucher);
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
    wait(1000).then(() => {
        MoveFastaFile(Voucher);
        MoveResultFile(Voucher);
        MoveResultTxt(Voucher);
    }).catch(() => {
    console.log(`Error move file ${Voucher}!`);
    });
    wait(2000).then(() => {
        OutPutFile(Voucher);
        }).catch(() => {
        console.log(`Error move file ${Voucher}!`);
        });
}
// Output File HTML
function OutPutFile(Voucher){
    Main = '\n<tr>\n'+
    '<td class="AccessionID"><a class="btn btn-lg btn-primary w-100" href="https://www.ncbi.nlm.nih.gov/nuccore/'+Voucher+'" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i> '+Voucher+'</a></td>\n'+
    '<td class="OrganismID"><a class="btn btn-lg btn-primary w-100" href="https://www.ncbi.nlm.nih.gov/nuccore/'+Voucher+'" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i><i class="text-left"> '+Organism(Voucher)+'</i></a></td>\n'+
    '<td class="LenGenomeID"><button type="button" class="btn btn-lg btn-info w-100 ">'+LengthGenome(Voucher)+'</button></td>\n'+
    '<td class="LenCRID"><button type="button" class="btn btn-lg btn-info w-100">'+LengthRC(Voucher)+'</button></td>\n'+
    '<td class="DownloadFastaCDID noToTable">'+Fasta(Voucher)+'</td>\n'+
    '<td class="RepeatsID"><a class="btn btn-lg btn-primary w-100" href="Results/'+Voucher+'.fasta.2.5.7.80.10.50.2000.1.html" target="_blank" role="button"><i class="fa-solid fa-arrow-up-right-from-square"></i> '+Repeats(Voucher)+'</a></td>\n'+
    '<td class="IndicesID">'+Indice(Voucher)+'</td>\n'+
    '<td class="PeriodSID">'+CopyN(Voucher)+'</td>\n'+
    '<td class="CopyID">'+PSize(Voucher)+'</td>\n'+
    '<td class="ConsensusID">'+CopyN(Voucher)+'</td>\n'+
    `<td class="ConsensusbtnID noToTable"><a class="btn btn-lg btn-primary w-100" href="Consensus/${Voucher}.fasta" download="Consensus_${Voucher}.fasta" type="text/plain" target="_blank" role="button"><i class="fa-solid fa-download"></i> Download</a></td>\n`+
    '<td class="ConsensusSeqID">'+Consensus(Voucher)+'</td>\n'+
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


  function Consensus(Voucher) {
    CreateFolder("Consensus");
    TableC = [];
    const { convert } = require('html-to-text');
    try {
      const FileHTML = fs.readFileSync("Results/" + Voucher + ".fasta.2.5.7.80.10.50.2000.1.txt.html", 'utf8');
      const text = convert(FileHTML, {wordwrap: 130});
      List = text.split("\n");
      List.forEach(function (value, index) {
        if (value.includes("Consensus pattern (") == true) {

          if(List[index+1].includes("Found at i") == false && List[index+1].includes("Done") == false){

            if(!!List[index+1]){

              if(List[index+2].includes("Found at i") == false && !!List[index+2] && List[index+2].includes("Done") == false){
                DatatoWrite = '>'+
                Voucher+
                '\n'+
                List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                '\n';
                
                if(List[index+3].includes("Found at i") == false && !!List[index+3] && List[index+3].includes("Done") == false){
                  DatatoWrite = '>'+
                  Voucher+
                  '\n'+
                  List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                  List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                  List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                  '\n';
                 
                  if(List[index+4].includes("Found at i") == false && !!List[index+4] && List[index+4].includes("Done") == false){
                    DatatoWrite = '>'+
                    Voucher+
                    '\n'+
                    List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                    List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                    List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                    List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                    '\n';
                   
                    if(List[index+5].includes("Found at i") == false && !!List[index+5] && List[index+5].includes("Done") == false){
                      DatatoWrite = '>'+
                      Voucher+
                      '\n'+
                      List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                      List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                      List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                      List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                      List[index+5].replace("\r", "").replace("\n", "").replace("Done.", "")+
                      '\n';
                      
                      if(List[index+6].includes("Found at i") == false && !!List[index+6] && List[index+6].includes("Done") == false){
                        DatatoWrite = '>'+
                        Voucher+
                        '\n'+
                        List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                        List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                        List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                        List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                        List[index+5].replace("\r", "").replace("\n", "").replace("Done.", "")+
                        List[index+6].replace("\r", "").replace("\n", "").replace("Done.", "")+
                        '\n';
                       
                        if(List[index+7].includes("Found at i") == false && !!List[index+7] && List[index+7].includes("Done") == false){
                          DatatoWrite = '>'+
                          Voucher+
                          '\n'+
                          List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          List[index+5].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          List[index+6].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          List[index+7].replace("\r", "").replace("\n", "").replace("Done.", "")+
                          '\n';
                          
                          if(List[index+8].includes("Found at i") == false && !!List[index+8] && List[index+8].includes("Done") == false){
                            DatatoWrite = '>'+
                            Voucher+
                            '\n'+
                            List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+5].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+6].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+7].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            List[index+8].replace("\r", "").replace("\n", "").replace("Done.", "")+
                            '\n';
                            
                            if(List[index+9].includes("Found at i") == false && !!List[index+9] && List[index+9].includes("Done") == false){
                              DatatoWrite = '>'+
                              Voucher+
                              '\n'+
                              List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+5].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+6].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+7].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+8].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              List[index+9].replace("\r", "").replace("\n", "").replace("Done.", "")+
                              '\n';
                              
                              if(List[index+10].includes("Found at i") == false && !!List[index+10] && List[index+10].includes("Done") == false){
                                DatatoWrite = '>'+
                                Voucher+
                                '\n'+
                                List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+3].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+4].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+5].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+6].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+7].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+8].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+9].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                List[index+10].replace("\r", "").replace("\n", "").replace("Done.", "")+
                                '\n';
                  
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                DatatoWrite = '>'+Voucher+'\n'+List[index+1].replace("\r", "").replace("\n", "").replace("Done.", "")+List[index+2].replace("\r", "").replace("\n", "").replace("Done.", "")+'\n';
              } 
              await = fs.writeFileSync(`Consensus/${Voucher}.fasta`, DatatoWrite, {encoding: "utf8", flag: 'a+'});
              TableC.push(DatatoWrite);
            }
          }
        }
      });
      Table = TableC.join("<br>");
      return Table;
    } catch (err) {
      console.error(err);
    }
  }


function Header() {
  HTMLHead = 
  '<!doctype html>\n'+
  '<html>\n'+
  '<head>\n'+
  '<meta charset="utf-8">\n'+
  '<title>M-TeReSA v1.0</title>\n'+
  '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>\n'+
  '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">\n'+
  '<script src="https://kit.fontawesome.com/7d94912b47.js" crossorigin="anonymous"></script>\n'+
  '<script src="https://code.jquery.com/jquery-3.6.0.js"></script>\n'+
  '<script src="https://cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>\n'+
  '<style>\n'+
	'td {\n'+
	'vertical-align: middle;\n'+
	'}\n'+	
  'table, table th {'+
  'vertical-align: middle;\n'+
  'text-align: center;\n'+
  '}\n'+
  'tr:nth-child(even) {background: #CCC}\n'+
  'tr:nth-child(odd) {background: #FFF}\n'+
  '</style>\n'+
  '</head>\n'+
  '<body class="bg-black font-monospace text-center">\n'+
  '<img class="mt-5 mb-2" src="lib/img/Logo2.png" width="10%">\n'+
  '<div class="h1 text-center text-white mt-1 mb-1">M-TeReSA - v1.0</div>\n'+
  '<div class="text-center h4 text-white mt-3 mb-3">Please cite:<br>G. Benson, "Tandem repeats finder: a program to analyze DNA sequences" Nucleic Acid Research (1999) Vol. 27, No. 2, pp. 573-580.</div>\n'+
  '<div class="text-center h4 text-white mt-1 mb-1">Gomes et al. (2022)</div>\n'+
  '<div class="container mt-5">\n'+
  '<div class="row row-cols-4 text-white text-start justify-content-md-center">\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="AccessionCheck" value="" checked="checked"><label class="form-check-label" for="AccessionCheck">Accession</label></div></div>\n'+	
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="OrganismCheck" value="" checked="checked"><label class="form-check-label" for="OrganismCheck">Organism</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="LenGenomeCheck" value=""><label class="form-check-label" for="LenGenomeCheck">Length Genome</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="LenCRCheck" value="" checked="checked"><label class="form-check-label" for="LenCRCheck">Length Control Region</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="DownloadFastaCheck" value=""><label class="form-check-label" for="DownloadFastaCheck">Download Control Region</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="RepeatsCheck" value="" checked="checked"><label class="form-check-label" for="RepeatsCheck">Repeats</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="IndicesCheck" value="" checked="checked"><label class="form-check-label" for="IndicesCheck">Indices</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="PeriodSizeCheck" value="" checked="checked"><label class="form-check-label" for="PeriodSizeCheck">Period Size</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="CopyNumberCheck" value="" checked="checked"><label class="form-check-label" for="CopyNumberCheck">Copy Number</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="ConsensusSizeCheck" value="" checked="checked"><label class="form-check-label" for="ConsensusSizeCheck">Consensus Size</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="ConsensusSequenceDownloadCheck" value=""><label class="form-check-label" for="ConsensusSequenceDownloadCheck">Consensus Sequence Download</label></div></div>\n'+
  '<div class="col h5 mt-2 mb-2"><div class="form-check"><input type="checkbox" class="form-check-input" id="ConsensusSequenceCheck" value=""><label class="form-check-label" for="ConsensusSequenceCheck">Consensus Sequence</label></div></div>\n'+
  '</div>\n'+
  '</div>\n'+
  '<div class="mx-auto w-75"><button id="ExcelExport" type="button" class="btn btn-block btn-lg btn-primary mb-3 mt-3 w-100"><i class="fa-solid fa-file-excel"></i> Export Excel File</button></div>\n'+
  '<table id="Table" class="table table-dark table-striped table-hover text-center table-bordered">\n<tbody>\n'+
    '\n<tr>\n'+
    '<td class="h4 AccessionID">Accession</td>\n'+
    '<td class="h4 OrganismID">Organism</td>\n'+
    '<td class="h4 LenGenomeID">Len. Genome (bp)</td>\n'+
    '<td class="h4 LenCRID">Len. CR (bp)</td>\n'+
    '<td class="h4 DownloadFastaCDID noToTable">Download Fasta (CR)</td>\n'+
    '<td class="h4 RepeatsID">Repeats</td>\n'+
    '<td class="h4 IndicesID">Indices</td>\n'+
    '<td class="h4 PeriodSID">Period Size</td>\n'+
    '<td class="h4 CopyID">Copy Number</td>\n'+
    '<td class="h4 ConsensusID">Consensus Size</td>\n'+
    '<td class="h4 ConsensusbtnID noToTable">Consensus Sequence</td>\n'+
    '<td class="h4 ConsensusSeqID">Consensus Sequence</td>\n'+
    '</tr>\n';
    fs.writeFileSync('M-TeReSA_Results.html', HTMLHead, {encoding: "utf8", flag: 'a+'});
}

function Footer(){
  HTMLFooter = 
  '</tbody>\n</table>\n'+'<script>\n'+
  '$(document).ready(function(){\n'+
  '$(".LenGenomeID").hide();\n'+
  '$(".ConsensusSeqID").hide();\n'+
  '$(".DownloadFastaCDID").hide();\n'+
  '$(".ConsensusbtnID").hide();\n'+
  "$('#AccessionCheck').click(function() {\n"+
  '$(".AccessionID").toggle(this.checked);\n'+
  '});\n'+
  "$('#OrganismCheck').click(function() {\n"+
  '$(".OrganismID").toggle(this.checked);\n'+
  '});\n'+
  "$('#LenGenomeCheck').click(function() {\n"+
  '$(".LenGenomeID").toggle(this.checked);\n'+
  '});\n'+
  "$('#LenCRCheck').click(function() {\n"+
  '$(".LenCRID").toggle(this.checked);\n'+
  '});\n'+
  "$('#DownloadFastaCheck').click(function() {\n"+
  '$(".DownloadFastaCDID").toggle(this.checked);\n'+
  '});\n'+
  "$('#RepeatsCheck').click(function() {\n"+
  '$(".RepeatsID").toggle(this.checked);\n'+
  '});\n'+
  "$('#IndicesCheck').click(function() {\n"+
  '$(".IndicesID").toggle(this.checked);\n'+
  '});\n'+
  "$('#PeriodSizeCheck').click(function() {\n"+
  '$(".PeriodSID").toggle(this.checked);\n'+
  '});\n'+
  "$('#CopyNumberCheck').click(function() {\n"+
  '$(".CopyID").toggle(this.checked);\n'+
  '});\n'+
  "$('#ConsensusSizeCheck').click(function() {\n"+
  '$(".ConsensusID").toggle(this.checked);\n'+
  '});\n'+
  "$('#ConsensusSequenceDownloadCheck').click(function() {\n"+
  '$(".ConsensusbtnID").toggle(this.checked);\n'+
  '});\n'+
  "$('#ConsensusSequenceCheck').click(function() {\n"+
  '$(".ConsensusSeqID").toggle(this.checked);\n'+
  '});\n'+

  '$("#ExcelExport").click(function() {\n'+
  'var preserveColors = ($("#Table").hasClass("table2excel_with_colors") ? true : false);\n'+
  '$("#Table").table2excel({\n'+
  'name: "M-TeReSA",\n'+
  'filename: "M-TeReSA.xls",\n'+
  'fileext: ".xls",\n'+
  'exclude: ".noToTable", exclude_img: true, exclude_links: true, exclude_inputs: true, preserveColors: preserveColors\n'+
  '});});});\n</script>\n'+'</body>\n</html>';
  wait(10000).then(() => {
    await = fs.writeFileSync('M-TeReSA_Results.html', HTMLFooter, {encoding: "utf8", flag: 'a+'}); 
    }).catch(() => {
    console.log(`Error move file ${Voucher}!`);
    });
}
  


data = fs.readFileSync(Args[0], {encoding:'utf8', flag:'r'});
console.log("--------------------------------------------------");
console.log("--------------------------------------------------");
console.log("------------------M-TeReSA v-1.0------------------");
console.log("--------------------------------------------------");
console.log("--------------------------------------------------");
console.log("Lima et al. (2022) - M-TeReSA: a simple tool for mitochondrial repeat sequences analysis");
console.log("Please wait...");
Header();
List = data.split("\r\n");
List.forEach(function(value){
  DownloadXML(value);
});
Footer();



