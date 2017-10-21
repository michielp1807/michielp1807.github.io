var totalDataBlocks = 4;  // total amount of data blocks
var group2DataBlocks = 0; // amount of data blocks in group 2
var dataBlockLength = 16; // amount of bites in group 1 (groep 2 has +1)



function updateDataBlocksHTML() {
  switch(version + errCorLevel) {
    case "1L":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 19;
      break;
    case "1M":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 16;
      break;
    case "1Q":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 13;
      break;
    case "1H":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 9;
      break;
    case "2L":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 34;
      break;
    case "2M":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 28;
      break;
    case "2Q":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 22;
      break;
    case "2H":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 16;
      break;
    case "3L":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 55;
      break;
    case "3M":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 44;
      break;
    case "3Q":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 17;
      break;
    case "3H":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 13;
      break;
    case "4L":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 80;
      break;
    case "4M":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 32;
      break;
    case "4Q":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 24;
      break;
    case "4H":
      totalDataBlocks = 4;
      group2DataBlocks = 0;
      dataBlockLength = 9;
      break;
    case "5L":
      totalDataBlocks = 1;
      group2DataBlocks = 0;
      dataBlockLength = 108;
      break;
    case "5M":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 43;
      break;
    case "5Q":
      totalDataBlocks = 4;
      group2DataBlocks = 2;
      dataBlockLength = 15;
      break;
    case "5H":
      totalDataBlocks = 4;
      group2DataBlocks = 2;
      dataBlockLength = 11;
      break;
    case "6L":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 68;
      break;
    case "6M":
      totalDataBlocks = 4;
      group2DataBlocks = 0;
      dataBlockLength = 27;
      break;
    case "6Q":
      totalDataBlocks = 4;
      group2DataBlocks = 0;
      dataBlockLength = 19;
      break;
    case "6H":
      totalDataBlocks = 4;
      group2DataBlocks = 0;
      dataBlockLength = 15;
      break;
    case "7L":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 78;
      break;
    case "7M":
      totalDataBlocks = 4;
      group2DataBlocks = 0;
      dataBlockLength = 31;
      break;
    case "7Q":
      totalDataBlocks = 6;
      group2DataBlocks = 4;
      dataBlockLength = 14;
      break;
    case "7H":
      totalDataBlocks = 5;
      group2DataBlocks = 1;
      dataBlockLength = 13;
      break;
    case "8L":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 97;
      break;
    case "8M":
      totalDataBlocks = 4;
      group2DataBlocks = 2;
      dataBlockLength = 38;
      break;
    case "8Q":
      totalDataBlocks = 6;
      group2DataBlocks = 2;
      dataBlockLength = 18;
      break;
    case "8H":
      totalDataBlocks = 6;
      group2DataBlocks = 2;
      dataBlockLength = 14;
      break;
    case "9L":
      totalDataBlocks = 2;
      group2DataBlocks = 0;
      dataBlockLength = 116;
      break;
    case "9M":
      totalDataBlocks = 5;
      group2DataBlocks = 2;
      dataBlockLength = 36;
      break;
    case "9Q":
      totalDataBlocks = 8;
      group2DataBlocks = 4;
      dataBlockLength = 16;
      break;
    case "9H":
      totalDataBlocks = 8;
      group2DataBlocks = 4;
      dataBlockLength = 12;
      break;
    case "10L":
      totalDataBlocks = 4;
      group2DataBlocks = 2;
      dataBlockLength = 68;
      break;
    case "10M":
      totalDataBlocks = 5;
      group2DataBlocks = 1;
      dataBlockLength = 43;
      break;
    case "10Q":
      totalDataBlocks = 8;
      group2DataBlocks = 2;
      dataBlockLength = 19;
      break;
    case "10H":
      totalDataBlocks = 8;
      group2DataBlocks = 2;
      dataBlockLength = 15;
      break;
    case "11L":
      totalDataBlocks = 4;
      group2DataBlocks = 0;
      dataBlockLength = 81;
      break;
    case "11M":
      totalDataBlocks = 5;
      group2DataBlocks = 4;
      dataBlockLength = 50;
      break;
    case "11Q":
      totalDataBlocks = 8;
      group2DataBlocks = 4;
      dataBlockLength = 22;
      break;
    case "11H":
      totalDataBlocks = 11;
      group2DataBlocks = 8;
      dataBlockLength = 12;
      break;
    case "12L":
      totalDataBlocks = 4;
      group2DataBlocks = 2;
      dataBlockLength = 92;
      break;
    case "12M":
      totalDataBlocks = 8;
      group2DataBlocks = 2;
      dataBlockLength = 36;
      break;
    case "12Q":
      totalDataBlocks = 10;
      group2DataBlocks = 6;
      dataBlockLength = 20;
      break;
    case "12H":
      totalDataBlocks = 11;
      group2DataBlocks = 4;
      dataBlockLength = 14;
      break;
    case "13L":
      totalDataBlocks = 7;
      group2DataBlocks = 0;
      dataBlockLength = 107;
      break;
    case "13M":
      totalDataBlocks = 9;
      group2DataBlocks = 1;
      dataBlockLength = 37;
      break;
    case "13Q":
      totalDataBlocks = 12;
      group2DataBlocks = 4;
      dataBlockLength = 20;
      break;
    case "13H":
      totalDataBlocks = 16;
      group2DataBlocks = 4;
      dataBlockLength = 11;
      break;
    default:
      console.log("Error: no '" + version + errCorLevel + "' in updateDataBlocksHTML");
      break;
  }

  let htmlText =  "<i>Jij hebt <b>Version "+version+"</b> en <b>Error Correctie Level "+errCorLevel+"</b>, dus jij hebt <b>";
  if (group2DataBlocks > 0) {
    if (totalDataBlocks-group2DataBlocks === 1) {
      htmlText += "1 datablok</b> van <b>"+dataBlockLength+" bytes</b> lang en <b>";
    } else {
      htmlText += (totalDataBlocks-group2DataBlocks)+" datablokken</b> van <b>"+dataBlockLength+" bytes</b> lang en <b>";
    }
    if (group2DataBlocks === 1) {
      htmlText += "1 datablok</b> van <b>"+(dataBlockLength+1)+" bytes</b> lang.</i>";
    } else {
      htmlText += group2DataBlocks+" datablokken</b> van <b>"+(dataBlockLength+1)+" bytes</b> lang.</i>";
    }
  } else {
    if (totalDataBlocks === 1) {
      htmlText += "1 datablok</b> van <b>"+dataBlockLength+" bytes</b> lang.</i>";
    } else {
      htmlText += totalDataBlocks+" datablokken</b> van <b>"+dataBlockLength+" bytes</b> lang.</i>";
    }
  }
  document.getElementById("dataBlocksText").innerHTML = htmlText;
}
