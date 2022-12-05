
  if (cookie){
    fetch("/search/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				userid: cookie.id,
				cookie: cookie.cookie
			})
		}).then((response) => response.json())
			.then((data) => {
				if (data.status === 200) {
					//console.log(data.rows[0]);

          // INSERT TASKS INTO TO-DO / IN-PROGRESS / COMPLETED DIVS

        }
        else {
          //console.log("status: ", data.status);
        }
      });
  }

  dragula([
  	document.getElementById('1'),
  	document.getElementById('2'),
  	document.getElementById('3'),
  ])

  .on('drag', function(el) {

  	// add 'is-moving' class to element being dragged
  	el.classList.add('is-moving');
  })
  .on('dragend', function(el) {

  	// remove 'is-moving' class from element after dragging has stopped
  	el.classList.remove('is-moving');

  	// add the 'is-moved' class for 600ms then remove it
  	window.setTimeout(function() {
  		el.classList.add('is-moved');
  		window.setTimeout(function() {
  			el.classList.remove('is-moved');
  		}, 600);
  	}, 100);
  });
