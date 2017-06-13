document.addEventListener("DOMContentLoaded", function(event) { 


	//Get text from _chat.txt
	d3.csv("_chat.txt", function(data) {
		var textData = formatTextData(data)

		// console.log("textData: ", textData);


		var transitionSpeed = 3000
		var trans = d3.transition()
			.duration(transitionSpeed)
			.ease(d3.easeLinear)

		//FROM EXAMPLE
		var fill = d3.scaleOrdinal(d3.schemeCategory20);
		var fontScale = d3.scaleLinear()
			.range([4, 50])
			.domain([
				d3.min(textData, function(d) {
					return d.size
				}),
				d3.max(textData, function(d) {
					return d.size
				})
			])
		// console.log("fontScale domain: ", fontScale.domain(), ", range: ", fontScale.range())

		
		var layout = d3.cloud()
		    .size([1000, 500])
		    // .words([
		    //   "Hello", "world", "normally", "you", "want", "more", "words",
		    //   "than", "this"].map(function(d) {
		    //   return {text: d, size: 10 + Math.random() * 90, test: "haha"};
		    // }))
		    // .words(textData)
		    .padding(16)
		    .rotate(function() { return ~~(Math.random() * 2) * 90; })
		    .font("Impact")
		    .fontSize(function(d) { return fontScale(d.size); })
		    // .on("end", draw);

		  var svg = d3.select("body").append("svg")
	      .attr("width", layout.size()[0])
	      .attr("height", layout.size()[1])
		    .append("g")
		      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")

		  // layout.words(nextData);
		  // layout.start();

				
		// layout.start();

		function draw(words) {
			console.log("draw called! words: ", words)
		  var text = svg.selectAll("text")
		      .data(words, function (d) {return d.text})

		  var n = 0;
		  text.each(function() { 
	       n++;
	   	})
		  .transition(trans).duration(transitionSpeed).ease(d3.easeLinear)
		  .on('end', function() {
		  		n--;
	       if (!n) {
	           nextTick();
	       }
		  })
	      .style("font-size", function(d) { return fontScale(d.size) + "px"; })
	      .attr("transform", function(d) {
	        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	      })
		   text.enter().append("text")
	      .style("font-family", "Impact")
	      .style("fill", function(d, i) { return fill(i); })
	      .attr("text-anchor", "middle")
	      .text(function(d) { return d.text; })
	      .each(function() {
		       n++;
		   	})
	      .transition(trans).duration(transitionSpeed).ease(d3.easeLinear)
	      .on('end', function() {
			  		n--;
		       if (!n) {
		           nextTick();
		       }
			  })
		      .style("font-size", function(d) { return fontScale(d.size) + "px"; })
		      .attr("transform", function(d) {
		        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		      })
		   text.exit()
		   .each(function() {
		       n++;
		   	})
		   	.transition(trans).duration(transitionSpeed).ease(d3.easeLinear)
		   	.on('end', function() {
			  		n--;
		       if (!n) {
		           nextTick();
		       }
			  })
		   	.style("font-size", 1)
		   	.remove()

		  nextData = formatTextData(allData.slice(tickIndex, tickIndex + 10));
		}

		var allData = data;
		var tickIndex = 0;
		var nextData = formatTextData(allData.slice(tickIndex, tickIndex + 10));
		function nextTick () {
			// if (tickIndex) {
			// 	// layout.on('end', function() {})
			// 	console.log("drawing again:")
			// 	setTimeout(function(){
			// 		draw(nextData) //draw previous data first
			// 	},200)
			// }
			// nextData = formatTextData(allData.slice(tickIndex, tickIndex + 10));

			console.log("nextTick called! tickIndex: ", tickIndex)
			tickIndex++
			layout.on('end', draw)
			layout.words(nextData);
			
				setTimeout(function(){
					layout.start();
				},0)
			// layout.start()

		}

		//START!!!
		nextTick()

		function startTick (data) {
			// var remainingData = textData;
			var allData = data
			var index = 0
			var interval = setInterval(function() {
				var nextData = formatTextData(allData.slice(index, index + 10));
				index++


				// console.log("ticking along! allData length: ", allData.length)
				layout.words(nextData);
				layout.start();

				// if (allData.length === 0) {
				// 	console.log("stopping interval!");
				// 	clearInterval(interval);
				// }
				if (index === allData.length - 1) {
					console.log("stopping interval!");
					clearInterval(interval);
				}
			}, 1000)
		}

		// startTick(data)
	});
});

function formatTextData (data) {
	// console.log("data: ", data);


			// var gLove = 0;
			// var kLove = 0;
		// Object.keys(data)
		var chatData = data.slice(0, 50).map(function (line, index) {
			// console.log("line ", index, ": ", line);
			var lineValues = Object.values(line)[0];
			var splitLine = lineValues.split(/\: /);
			var nameLine = splitLine[1] === "Giorgia's Phone" ? 'Giorgia' : 'Kevin'
			var textLine = splitLine.slice(2).join(': ')
				.replace(/<[\w|\s]+>/g, '')
				.replace(/\.|,|\?|\"|\*|\!/g, '');

			// console.log("textLine: ", textLine)
			// var wordMatch = /love you/i

			// if (textLine.match(wordMatch) && nameLine == 'Giorgia') {
			// 	gLove += 1
			// }

			// if (textLine.match(wordMatch) && nameLine == 'Kevin') {
			// 	kLove += 1;
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

		// console.log("dictionary length: ", Object.keys(dictionary))

		var textData = Object.keys(dictionary).map(function(entry) {
			return {
				text: entry,
				size: dictionary[entry]
			}
		})

		return textData
}