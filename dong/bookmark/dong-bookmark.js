$.ajax({
  url : "../websites.csv",
  dataType: "text",
  success : function (data) {
    let arr = data.match(/[^\r\n]+/g);
    let websites = [];
    for (let i=0; i<arr.length; i++) {
      arr[i] = arr[i].split(/,/);
      if (i>0) {
        websites[i-1] = {};
        for (let j=0; j<arr[i].length; j++) {
          websites[i-1][arr[0][j]] = arr[i][j];
        }
      }
    }
    console.log(websites);
    let index = Math.floor(Math.random()*websites.length);
    window.location.href = websites[index].url;
  }
});
