document.addEventListener("DOMContentLoaded", function(event) { 


	//Get text from _chat.txt
	d3.csv("_chat.txt", function(data) {
		var textData = formatTextData(data)

		console.log("textData: ", textData);


		//FROM EXAMPLE
		var fill = d3.scaleOrdinal(d3.schemeCategory20);
		var fontScale = d3.scaleLinear()
			.range([6, 24])
			.domain([
				d3.min(textData, function(d) {
					return d.size
				}),
				d3.max(textData, function(d) {
					return d.size
				})
			])
		console.log("fontScale domain: ", fontScale.domain(), ", range: ", fontScale.range())

		
		var layout = d3.cloud()
		    .size([750, 400])
		    // .words([
		    //   "Hello", "world", "normally", "you", "want", "more", "words",
		    //   "than", "this"].map(function(d) {
		    //   return {text: d, size: 10 + Math.random() * 90, test: "haha"};
		    // }))
		    .words(textData)
		    .padding(5)
		    .rotate(function() { return ~~(Math.random() * 2) * 90; })
		    .font("Impact")
		    .fontSize(function(d) { return fontScale(d.size); })
		    .on("end", draw);

		  var svg = d3.select("body").append("svg")
	      .attr("width", layout.size()[0])
	      .attr("height", layout.size()[1])
		    .append("g")
		      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")

		// layout.start();

		function draw(words) {
			console.log("draw called! words: ", words)
		  var text = svg.selectAll("text")
		      .data(words, function (d) {return d.text})

		  text.transition()
	      .style("font-size", function(d) { return fontScale(d.size) + "px"; })
	      .attr("transform", function(d) {
	        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	      })
		   text.enter().append("text")
	      .style("font-family", "Impact")
	      .style("fill", function(d, i) { return fill(i); })
	      .attr("text-anchor", "middle")
	      .text(function(d) { return d.text; })
	      .transition()
		      .style("font-size", function(d) { return fontScale(d.size) + "px"; })
		      .attr("transform", function(d) {
		        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		      })
		   text.exit()
		   	.transition()
		   	.style("font-size", 1)
		   	.remove()
		}

		function startTick (data) {
			// var remainingData = textData;
			var allData = data
			var interval = setInterval(function() {
				var nextData = formatTextData(allData.splice(0,50));

				console.log("ticking along! allData length: ", allData.length)
				layout.words(nextData);
				layout.start();

				if (allData.length === 0) {
					console.log("stopping interval!");
					clearInterval(interval);
				}
			}, 2000)
		}

		startTick(data)
	});
});

function formatTextData (data) {
	console.log("data: ", data);


			// var gLove = 0;
			// var kLove = 0;
		// Object.keys(data)
		var chatData = data.slice(0, 50).map(function (line, index) {
			// console.log("line ", index, ": ", line);
			var lineValues = Object.values(line)[0];
			var splitLine = lineValues.split(/\: /);
			var nameLine = splitLine[1] === "Giorgia's Phone" ? 'Giorgia' : 'Kevin'
			var textLine = splitLine.slice(2).join(': ')
				.replace(/<\w>/g, '')
				.replace(/\.|,|\?|\"|\*/g, '');

			// console.log("textLine: ", textLine)
			// var wordMatch = /love you/i

			// if (textLine.match(wordMatch) && nameLine == 'Giorgia') {
			// 	gLove += 1
			// }

			// if (textLine.match(wordMatch) && nameLine == 'Kevin') {
			// 	kLove += 1;
			// }

			// if (nameLine == 'Giorgia') {
			// 	gLove += 1
			// }

			// if (nameLine == 'Kevin') {
			// 	kLove += 1;
			// }

			// if (textLine.match(/love/i)) {
			// 	console.log(nameLine, textLine)
			// }

			//EXAMPLE DATA FORMAT:
			// {
			// 	sender: 'Kevin' // Giorgia,
			// 	dateTime: '13/06/15 10:59:59',
			// 	text: 'Hey how are you'
			// }
			return {
				dateTime: splitLine[0],
				sender: nameLine,
				text: textLine
			}
		});



		// console.log("chatData: ", chatData.slice(0, 10));

		// console.log("kLove: ", kLove, ", gLove: ", gLove);

		//make frequency count
		var dictionary = {}

		chatData.forEach(function(msg) {
			// console.log("msg: ", msg, ", msg.text.split(): ", msg.text.split(' '));
			msg.text.split(' ').forEach(function(wrd) {
				if (dictionary[wrd]) {
					dictionary[wrd] += 1
				} else {
					dictionary[wrd] = 1
				}
			})

			// console.log("dictionary: ", dictionary)
		});

		console.log("dictionary length: ", Object.keys(dictionary))

		var textData = Object.keys(dictionary).map(function(entry) {
			return {
				text: entry,
				size: dictionary[entry]
			}
		})

		return textData
}