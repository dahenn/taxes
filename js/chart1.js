Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function getTax() {

    d3.csv('data/tax_calc.csv', function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
            d.current_single = +d['current.single'];
            d.current_married = +d['current.married'];
            d.trump_single = +d['trump.single'];
            d.trump_married = +d['trump.married'];
            d.diff_single = +d['diff.single'];
            d.diff_married = +d['diff.married'];
            d.income = +d.income;
            d.pctincome_single = +d['pctincome.single'];
            d.pctincome_married = +d['pctincome.married'];
        });
        var income = document.getElementById('income').value;
        if (income==''){alert('Please input income');}
        if (income>2000000){alert('Input income below $2,000,000');}
        var r_inc = Math.round(income/1000)*1000;
        var incdata = data[(r_inc/1000)];
        var radios = document.getElementsByName('filing');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                var filing = radios[i].value;
                break;
            }
        }
        if (filing=='Single') {
            d3.select('span#current').html('$' + incdata.current_single.formatMoney(2));
            d3.select('span#trump').html('$' + incdata.trump_single.formatMoney(2));
            d3.select('span#difference').html(incdata.diff_single.formatMoney(2));
            d3.select('span#incomepct').html((incdata.pctincome_single*100).formatMoney(2) + '%');
        }
        if (filing=='Married') {
            d3.select('span#current').html('$' + incdata.current_married.formatMoney(2));
            d3.select('span#trump').html('$' + incdata.trump_married.formatMoney(2));
            d3.select('span#difference').html(incdata.diff_married.formatMoney(2));
            d3.select('span#incomepct').html((incdata.pctincome_married*100).formatMoney(2) + '%');
        }
        /*
        console.log(r_inc);
        console.log(filing);
        console.log(data[(r_inc/1000)]);
        */
    });
    return income;
}

function type(d, _, columns) {
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}
