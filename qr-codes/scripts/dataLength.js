var dataLengthBits = 0;

function updateDataLengthHTML() {
  if (version < 10) {
    if (dataTypeName == "Numeric Mode") {
      dataLengthBits = 10;
    } else if (dataTypeName == "Alphanumeric Mode") {
      dataLengthBits = 9;
    } else if (dataTypeName == "Byte Mode") {
      dataLengthBits = 8;
    } else if (dataTypeName == "Kanji Mode") {
      dataLengthBits = 8;
    } else {
      //console.log("Incorrect dataTypeName: " + dataTypeName);
      dataLengthBits = false;
    }
  } else {
    if (dataTypeName == "Numeric Mode") {
      dataLengthBits = 12;
    } else if (dataTypeName == "Alphanumeric Mode") {
      dataLengthBits = 11;
    } else if (dataTypeName == "Byte Mode") {
      dataLengthBits = 16;
    } else if (dataTypeName == "Kanji Mode") {
      dataLengthBits = 10;
    } else {
      //console.log("Incorrect dataTypeName: " + dataTypeName);
      dataLengthBits = false;
    }
  }
  if (dataLengthBits != false) {
    document.getElementById("dataLengthBits").innerHTML = `<i>Jij hebt <b>Version ${version}</b> en je gebruikt <b>${dataTypeName}</b>, dus is de Character Count Indicator <b>${dataLengthBits} bits</b> lang.</i>`;
  } else {
    document.getElementById("dataLengthBits").innerHTML = "<i>Je hebt bij stap 4 een <b>niet-kloppende Mode Indicator</b> ingevuld, dus weten we niet hoe lang de data is.</i>";
  }
}
