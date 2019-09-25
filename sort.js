function stop(){
	// enables sliders, hides stop button, displays start button
	stop_array[0] = true;
	start_btn.innerHTML = 'sort;';
	size_slider.disabled = false; 
	speed_slider.disabled = false;
}

function start(){
	// diables sliders, dispalys stop button, hides start button
	stop_array[0] = false;
	start_btn.innerHTML = 'stop';
	// stop_btn.style = 'display: block;';
	size_slider.disabled = true; 
	//speed_slider.disabled = true;
}

function create_dataset(entrances){
	//creates starting dataset
	if (3 <= entrances <= 100){
		var dataset = [];
		for (i=0; i<entrances; i++){
			dataset.push(Math.floor(Math.random() * 100 + 1));
		}
		return dataset;
	}
	// Just in case of some smartass tinkering with HTML
	return [1,2,3,4,5]
}

function create_chart(dataset, background_array){
	// Creates chart object
	// Create empty labels 
	var empty_labels = [];
	for (i=0; i<dataset.length; i++){
		empty_labels.push('');
	}

	var chart = document.getElementById('chart').getContext('2d');
	var myChart = new Chart(chart, {
	    type: 'bar',
	    data: {
	        labels: empty_labels,
	        datasets: [{
	            data: dataset,
	            backgroundColor: background_array,
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	            	gridLines:{
	            		display:false,
	            		drawBorder:false
	            	},
	                ticks: {
	                    beginAtZero: true,
	                    display: false
	                }
	            }],
	            xAxes: [{
	            	gridLines:{
	            		display:false,
	            	}
	                
	            }]
	        },
	        animation: {
	        	duration: 0
	        },
	        legend: {
	        	display: false
	        }
	    }
	});
	return myChart
}

function create_background_array(dataset){
	// creates array containing info about graphs color
	var background_array = []
	for (i=0; i<dataset.length;i++){
		background_array.push('rgba(0, 128, 255, 0.4)');
	}
	return background_array;
}

function fill_background_array(background_array, rgba_string){
	//fills background array with selected color
	for(let i=0; i<background_array.length; i++){
		background_array[i] = rgba_string;
	}
}

async function selection_sort(chart, data, background_array, sleep_time, stop_array){
	var swap_index;
	var swap_value;

	for (j=0; j<data.length-1; j++){
		var min = data[j];
		swap_index = j;
		for (i=j; i<data.length; i++){
			if (data[i]<min){
				min = data[i];
				swap_index = i;
			}
			// check if user wanted to stop
			if (stop_array[0]){
				stop();
				return;
			}
			// wait and update chart
			await sleep(sleep_time.value);
			selection_sort_colors(background_array, i, j, swap_index);
			chart.update();
		}
		// swap values
		swap_value = data[j];
		data[j] = min;
		data[swap_index] = swap_value;
		
	}
	fill_background_array(background_array, 'rgba(0, 220, 0, 0.4)');
	chart.update();
	stop();
}

function selection_sort_colors(background_array, current_index, sorted_index, min_index){
	fill_background_array(background_array, 'rgba(0, 128, 255, 0.4)');
	for (let i=0; i<sorted_index; i++){
		background_array[i] = 'rgba(0, 220, 0, 0.4)';
	}
	background_array[current_index] = 'rgba(220, 250, 0, 0.4)';
	background_array[min_index] = 'rgba(0, 0, 204, 0.4)';

}

async function insertion_sort(chart, dataset, background_array, sleep_time, stop_aray){
	console.log(dataset);
	for(let i=1; i<dataset.length; i++){
		let x = dataset[i];
		let j = i-1;
		while(j>=0 && dataset[j]>x){
			dataset[j+1] = dataset[j];
			insertion_sort_colors(background_array, j, i);
			chart.update();

			if (stop_array[0]){
				stop();
				return
			}

			await sleep(sleep_time.value);
			j -= 1;
		}
		dataset[j+1] = x;
	}
	fill_background_array(background_array,'rgba(0, 220, 0, 0.4)'); //Green
	chart.update();
	stop();
}

function insertion_sort_colors(background_array, current_index, selected_index){
	for (let i=0; i<background_array.length;i++){
		if (i <= selected_index){
			background_array[i] = 'rgba(0, 220, 0, 0.4)';
		} else {
			background_array[i] = 'rgba(0, 128, 255, 0.4)';
		}
	}
	background_array[current_index] = 'rgba(220, 250, 0, 0.4)'; //yellow
}

async function cocktail_sort(chart, dataset, background_array, sleep_time){
	var end = dataset.length - 1;
	var start = 0;
	var swapped = true;
	while (swapped){
		//left to right
		swapped = false;
		for (let i=start; i<end; i++){
			if(dataset[i] > dataset[i+1]){
				let x = dataset[i+1];
				dataset[i+1] = dataset[i];
				dataset[i] = x;
				swapped = true;
			}
			// checks for stop
			if (stop_array[0]){
				stop();
				return
			}
			// update chart
			cocktail_sort_colors(background_array, i+1, start, end);
			chart.update();
			await sleep(sleep_time.value);
		}

		//if nothing was swapped then dataset is in order
		end -= 1;
		if (swapped==false){
			break;
		}
		swapped = false;
		//right to left
		for (let i=end; i>start; i--){
			if(dataset[i]<dataset[i-1]){
				let x = dataset[i-1];
				dataset[i-1]= dataset[i];
				dataset[i] = x;
				swapped = true;
			}
			// check for stop
			if (stop_array[0]){
				stop();
				return
			}
			//update chart
			cocktail_sort_colors(background_array, i-1, start, end);
			chart.update();
			await sleep(sleep_time.value);
		}
		start +=1;
	}
	fill_background_array(background_array,'rgba(0, 220, 0, 0.4)');
	chart.update();
	stop();
}

function cocktail_sort_colors(background_array, highlited_index, start, end){
	// color sorted beginning
	fill_background_array(background_array,'rgba(0, 128, 255, 0.4)');
	for (let i=0; i<start; i++){
		background_array[i] = 'rgba(0, 220, 0, 0.4)';
	}
	// color sorted end
	for (let i=end+1; i<background_array.length; i++){
		background_array[i] = 'rgba(0, 220, 0, 0.4)';
	}
	background_array[highlited_index] = 'rgba(220, 250, 0, 0.4)';
}

async function merge_sort(chart, dataset, background_array, speed_slider, stop_array){
	let temp_array = dataset.map(num =>[num]);

	while (temp_array.length > 1){
		let isOdd = temp_array.length % 2;
		if (isOdd){
			temp_array[0] = merge_arrays(temp_array[0], temp_array[1]);
			temp_array.splice(1,1);

			merge_sort_colors(temp_array, background_array, dataset, 0);
			chart.update();

			if (stop_array[0]){
				stop();
				return;
			}

			await sleep(speed_slider.value);
		
		}
		for (let i=0; i<temp_array.length; i++){
			temp_array[i] = merge_arrays(temp_array[i], temp_array[i+1]);
			temp_array.splice(i+1, 1);
			merge_sort_colors(temp_array, background_array, dataset, 0);
			chart.update();

			if (stop_array[0]){
				stop();
				return;
			}
			await sleep(speed_slider.value);
		}
	}
	stop();
}

function merge_arrays(array1, array2){

	let left = 0;
	let right = 0;
	let temp = [];

	while (left <= array1.length-1 && right <= array2.length-1) {
		if (array1[left] <= array2[right]){
			temp.push(array1[left]);
			left++;
		} else {
			temp.push(array2[right]);
			right++;
		}
	}

	for (let i=left; i<array1.length; i++){
		temp.push(array1[i]);
	}

	for (let i=right; i<array2.length; i++){
		temp.push(array2[i]);
	}
	return temp;
}

function merge_sort_colors(temp_array, background_array, dataset, rightIndex){
	let colors_array = [
		'rgba(0,255, 255, 0.4)',
		'rgba(255, 0, 30, 0.4)',
		'rgba(255, 225, 230, 0.4)',
		'rgba(255, 90, 30, 0.4)',
		'rgba(255, 90, 255, 0.4)',
		'rgba(180, 90, 255, 0.4)',
		'rgba(180,90, 0, 0.4)',
		'rgba(0,0, 0, 0.4)',
		'rgba(135,135, 135, 0.4)',
	];
	let current_index = 0;
	for (let i=0; i<temp_array.length; i++){
		for (let j=0; j<temp_array[i].length; j++){
			background_array[current_index] = colors_array[i%9];
			dataset[current_index] = temp_array[i][j];
			current_index++;
		}
	}
}

async function bogo_sort(chart, dataset, background_array, speed_slider, stop_array){
	let sorted = false;
	while(!sorted){
		for (let i=0; i<dataset.length-1; i++){

			if (stop_array[0]){
				stop();
				return;
			}

			bogo_colors(background_array, i);
			chart.update();
			await sleep(speed_slider.value);

			if (dataset[i]<=dataset[i+1]){
				sorted = true;
			} else {
				sorted = false;
				break;
			}
		}
		if (!sorted){
			bogo_shuffle(dataset);
		} else {
			stop();
			return;
		}
	}

}

function bogo_shuffle(dataset){
	var j, x, i;
    for (i = dataset.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = dataset[i];
        dataset[i] = dataset[j];
        dataset[j] = x;
    }
}

function bogo_colors(background_array, currentIndex){
	fill_background_array(background_array, 'rgba(0, 128, 255, 0.4)'); //blue
	for (let i=0; i<currentIndex;i++){
		background_array[i] = 'rgba(0, 220, 0, 0.4)'; // green
	}
	background_array[currentIndex]= 'rgba(220, 250, 0, 0.4)'; //yellow
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function select_sorting(){
	// starts selected sorting
	stop_array[0]=false;
	var select_object = document.getElementById('sort_select');
	var sorting_id = select_object.options[select_object.selectedIndex].value;
	start();

	switch (sorting_id){
		case '1': 
		selection_sort(chart_o, dataset, background_array, speed_slider, stop_array);
		break;

		case '2':
		insertion_sort(chart_o, dataset, background_array, speed_slider, stop_array);
		break;

		case '3':
		cocktail_sort(chart_o, dataset, background_array, speed_slider, stop_array);
		break;

		case '4':
		merge_sort(chart_o, dataset, background_array, speed_slider, stop_array);
		break;

		case '5':
		bogo_sort(chart_o, dataset, background_array, speed_slider, stop_array);
		break;
	}
}

function update_dataset(dataset, background_array, chart, size_slider){
	for (let i=0; i<size_slider.value; i++){
		chart.data.datasets.forEach((dataset) => {
			dataset.data[i] = Math.floor(Math.random() * 100 + 1);
			dataset.backgroundColor[i] = 'rgba(0, 128, 255, 0.4)';
		});
		chart.data.labels[i] = '';
	}
	if (dataset.length>size_slider.value){
		console.log(parseInt(size_slider.value,10));
		for (let i=parseInt(dataset.length,10) - parseInt(size_slider.value,10); i>0; i--){
			chart.data.datasets.forEach((dataset) => {
				dataset.data.pop();
				dataset.backgroundColor.pop();
			});
			chart.data.labels.pop();
		}
	}
	chart.update();
}

var stop_array = [true]; // array because arrays are mutable
var dataset = create_dataset(3);
var background_array = create_background_array(dataset);
console.log(dataset);

var chart_o = create_chart(dataset, background_array);
var start_btn = document.getElementById('sort');
var size_slider = document.getElementById('size_slider');
var speed_slider = document.getElementById('speed_slider');

start_btn.addEventListener("click", function(){
	if (stop_array[0]){
		select_sorting();
	} else {
		stop();
	}
	
},false);
size_slider.addEventListener("input", function(){update_dataset(dataset, background_array, chart_o, size_slider);}, false);

