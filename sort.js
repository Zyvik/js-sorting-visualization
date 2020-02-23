function stop(){
	// enables sliders, hides stop button, displays start button
	stop_array[0] = true;
	start_btn.innerHTML = "<i class='fa fa-play fa-2x' aria-hidden='true'></i>";
	start_btn.className = "btn btn-lg btn-primary ml-3";
	size_slider.disabled = false; 
	speed_slider.disabled = false;
	reload_btn.disabled = false;
	select_object.disabled = false;
	data_type_select.disabled = false;
}

function start(){
	// diables sliders, dispalys stop button, hides start button
	stop_array[0] = false;
	start_btn.innerHTML = "<i class='fa fa-stop fa-2x' aria-hidden='true'></i>";
	start_btn.className = "btn btn-lg btn-danger ml-3";
	// stop_btn.style = 'display: block;';
	size_slider.disabled = true; 
	reload_btn.disabled = true;
	select_object.disabled = true;
	data_type_select.disabled = true;
}

function create_dataset(entrances){
	//creates starting dataset
	if (2 <= entrances <= 100){
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
			await sleep(-sleep_time.value);
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

			await sleep(-sleep_time.value);
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
			await sleep(-sleep_time.value);
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
			await sleep(-sleep_time.value);
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

			await sleep(-speed_slider.value);
		
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
			await sleep(-speed_slider.value);
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
			await sleep(-speed_slider.value);

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
			fill_background_array(background_array,'rgba(0, 220, 0, 0.4)');
			chart.update();
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

async function quick_sort(chart, dataset, background_array, speed_slider, stop_array){
	// iterative quicksort (because recursive function wont work with async)
	// stack keeps information about whitch indexes are sorted (true = sorted)
	var stack = new Array(dataset.length).fill(false);
	stack.push(true); // true at the end to ensure that function will always find right border
	var sorted = false;

	var l_border = 0;
	var r_border = stack.length-1;
	while (!sorted){
		// finds 1st unsorted index, sets it as left border for sorting
		for (let i=l_border; i<stack.length; i++){
			if (!stack[i]){
				l_border = i;
				break;  //breaks for
			}
			l_border = -1;
		}
		// if there is false value in stack - sort, else break
		if (l_border > -1){
			// finds 1st true value after left border, sets right border
			for (let i=l_border; i<stack.length; i++){
				if (stack[i]){
					r_border=i-1;
					break;
				}
			}
			// ACTUAL SORTING
			var pivot_index = r_border; //set last index to sort as pivot
			var left = l_border;  //left 'finger'
			var right = pivot_index-1; //right 'finger'
			while(true){
				// sets left finger (1st value that is greater than pivot)
				for (let i=left; i<pivot_index; i++){
					left = -1;

					if (stop_array[0]){
						stop();
						return;
					}

					quick_sort_colors(background_array, stack, pivot_index, left, right, i);
					chart.update();
					await sleep(-speed_slider.value);

					if (dataset[i]>dataset[pivot_index]){
						left = i;
						break;
					}
				}
				// if left finger doesnt exists then pivot is on the right place
				if (left == -1){
					stack[pivot_index] = true;
					break;
				} else {
					// sets right finger (last value that is lesser than pivot)
					for (let i=right; i>=0; i--){
						right = -1;

						if (stop_array[0]){
							stop();
							return;
						}

						quick_sort_colors(background_array, stack, pivot_index, left, right, i);
						chart.update();
						await sleep(-speed_slider.value);

						if (dataset[i]<dataset[pivot_index]){
							right = i;
							break;
						}
					}
					// if left > right swap left and pivot, then pivot will be on the right place
					if (left > right){
						swap(dataset, left, pivot_index);
						stack[left] = true;
						break;
					} else{
						//swap left and right, and continiue with same borders
						swap(dataset, left, right);
					}
				}
			}

		} else{
			sorted = true;
			fill_background_array(background_array, 'rgba(0, 220, 0, 0.4)');
			chart.update();
			stop();
		}
	}	
}

function quick_sort_colors(background_array, sorted_array, pivot, left_finger, right_finger, current_index){
	// blue - unsorted; green - sorted
	for (let i=0; i<background_array.length; i++){
		if (sorted_array[i]){
			background_array[i] = 'rgba(0, 220, 0, 0.4)'; // green
		} else {
			background_array[i] = 'rgba(0, 128, 255, 0.4)'; //blue
		}
	}
	// yellow - current
	background_array[current_index] = 'rgba(220, 250, 0, 0.4)'; //yellow
	background_array[pivot] = 'rgba(156, 2, 222, 0.4)'; // purple ?
	if (left_finger>-1){
		background_array[left_finger] = 'rgba(255, 0, 0, 0.4)'; //red
	}
	if (right_finger>-1){
		background_array[right_finger] = 'rgba(246, 112, 3, 0.4)'; //orange
	}
}

function swap(dataset, x, y){
	// swaps two values in dataset
	var temp = dataset[x];
	dataset[x] = dataset[y];
	dataset[y] = temp;
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

		case '6':
		quick_sort(chart_o, dataset, background_array, speed_slider, stop_array);
		break;
	}
}

function change_legend(select_object){
	var sorting_id = select_object.options[select_object.selectedIndex].value;
	var legend_span = document.getElementById('legend_span');
	switch (sorting_id){
		case '1':
		legend_span.innerHTML = "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:rgb(127, 0, 233);stroke-width:3;stroke:rgb(0,0,0)' /></svg> - minimum value </span><br>";
		break;

		case '6':
		legend_span.innerHTML = "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:rgb(156, 2, 222);stroke-width:3;stroke:rgb(0,0,0)' /></svg> - pivot </span><br>";
		legend_span.innerHTML += "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:rgb(255, 0, 0);stroke-width:3;stroke:rgb(0,0,0)' /></svg> - left \"finger\" (1st value greater than pivot) </span><br>";
		legend_span.innerHTML += "<span><svg width='20' height='20'><rect width='20' height='20' style='fill:rgb(246, 112, 0);stroke-width:3;stroke:rgb(0,0,0)' /></svg> - right \"finger\" (last value value lesser than pivot) </span><br>";
		break;

		default:
		legend_span.innerHTML = "";
		break;
	}
}
function update_dataset(dataset, background_array, chart, size_slider){
	var select_object = document.getElementById('data_type_select');
	var data_type_id = select_object.options[select_object.selectedIndex].value;

	switch (data_type_id){
		case '1':
		//Random
		for (let i=0; i<size_slider.value; i++){
			chart.data.datasets.forEach((dataset) => {
				dataset.data[i] = Math.floor(Math.random() * 100 + 1);
				dataset.backgroundColor[i] = 'rgba(0, 128, 255, 0.4)';
			});
			chart.data.labels[i] = '';
		}
		break;

		case '2':
		//Inverted
		for (let i=0; i<size_slider.value; i++){
			chart.data.datasets.forEach((dataset) => {
				dataset.data[i] = size_slider.value-i;
				dataset.backgroundColor[i] = 'rgba(0, 128, 255, 0.4)';

			});
			chart.data.labels[i]='';
		}
		break;

		case '3':
		//Almost sorted
		for (let i=0; i<size_slider.value; i++){
			chart.data.datasets.forEach((dataset) => {
				dataset.data[i] = i+1;
				dataset.backgroundColor[i] = 'rgba(0, 128, 255, 0.4)';

			});
			chart.data.labels[i]='';
		}
		//swap 2 values in sorted dataset
		var x, y;
		x = y = 0;
		while (x==y){
			x = Math.floor(Math.random() * size_slider.value);
			y = Math.floor(Math.random() * size_slider.value);
			}
		dataset[x] = y+1;
		dataset[y] = x+1;
	}

	// pop records if previous dataset was larger 
	if (dataset.length>size_slider.value){
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
var dataset = create_dataset(50);
var background_array = create_background_array(dataset);
console.log(dataset);

var chart_o = create_chart(dataset, background_array);
var start_btn = document.getElementById('sort');
var size_slider = document.getElementById('size_slider');
var speed_slider = document.getElementById('speed_slider');
var reload_btn = document.getElementById('reload');
var select_object = document.getElementById('sort_select');
var data_type_select = document.getElementById('data_type_select');


start_btn.addEventListener("click", function(){
	if (stop_array[0]){
		select_sorting();
	} else {
		stop();
	}
},false);
select_object.addEventListener("change", function(){change_legend(select_object);})
size_slider.addEventListener("input", function(){update_dataset(dataset, background_array, chart_o, size_slider);}, false);
reload_btn.addEventListener("click", function(){update_dataset(dataset, background_array, chart_o, size_slider);}, false);
data_type_select.addEventListener("change", function(){update_dataset(dataset, background_array, chart_o, size_slider);}, false);

change_legend(select_object); // browser sometimes remembers last selected item (legend is wrong because event isnt called)
