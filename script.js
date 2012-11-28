(function(){	
	
	var timeCalc = {

		init: function(config){
			
			config.storeHrs = [];
			config.storeMins = [];
			config.storeSecs = [];
			config.storeOperator = [];
			config.hrs = 0;
			config.mins = 0;
			config.secs = 0;
			config.pCarry = 0;
			config.nCarry = 0;
			config.NP = false;
			config.mCarry = 0;
			config.sCarry = 0;

			this.config = config;
			
			this.lockInput();
			this.allClear();
			this.clearDisplay();
			var conf = this.config;
				
			config.clear.on('click', function(){
				var tempDisplay = [],
					$this = timeCalc.config;

				$.each(timeCalc.config.display, function(){
					if( this.val() ) tempDisplay.push( this.val() );
				});

				if ( tempDisplay.length || ( $this.storeHrs.length ==0 && $this.storeOperator.length == 0 ) ) {
					timeCalc.clearDisplay();	
				} else {
					var conf = timeCalc.config,
						operatorArray = conf.storeOperator,
						hrsArray = conf.storeHrs,
						minArray = conf.storeMins,
						secArrary = conf.storeSecs,
						timePop;

					timePop = ( operatorArray.length >= hrsArray.length ) ? false : true; 

					if ( timePop ) {
						// This will pop elements only before pressing 'equal to'
						
						hrsArray.pop();
						minArray.pop();
						secArrary.pop();
						$('ul#roughUL').find('li:last').fadeOut(200).remove();
						
					} else {
						
						operatorArray.pop();
						$('ul#roughUL').find('li:last').fadeOut(200).remove();
						
					}
				} //end of else

				$(this).parent().siblings().find('button.op').removeClass('current');
			} );

			config.op.on('click', function(){
				var conf = timeCalc.config,
					dspHrs = conf.display['hrs'].val(),
					dspMins = conf.display['mns'].val(),
					dspSecs = conf.display['secs'].val();

					
					



				if ( ( conf.hrs == dspHrs && conf.mins == dspMins && conf.secs == dspSecs ) || dspHrs == 0 && dspMins == 0 && dspSecs == 0 ) {//to prevent the sum of the results from being push into the array 	
						timeCalc.clearDisplay();
				} else {
						timeCalc.insertOperand();
						timeCalc.clearDisplay();
				}
				timeCalc.insertOperator.call( this );	
				$(this).parent().siblings().find('button.op').removeClass('current').end().end().end().addClass('current');
				
				$(this).parents('div').siblings().find('results').text(''); 
				// $(this).addClass('current');
				

			});
	
			config.results.on('click', this.results );
			config.allClear.on('click', function(){
				timeCalc.allClear();
				timeCalc.clearRC();
				$(this).parent().siblings().find('.current').removeClass('current');
			});

			config.numberContainer.on( 'click','button.numberBtn', this.appendInput );


		},

		clearDisplay: function(){
			$.each(timeCalc.config.display, function(){
				this.val('');
			});
		},

		clearRC: function(){
			$('ul#roughUL').empty();
			
			$('results').text('');
		},

		allClear: function(){
			var $this = timeCalc;
				conf = $this.config;
			
				conf.storeOperator = [];
				
				$this.clearDisplay();

				conf.storeHrs = [];
				conf.storeMins = [];
				conf.storeSecs = [];
				conf.hrs = 0;
				conf.mins = 0;
				conf.secs = 0;
				conf.pCarry = 0;
				conf.nCarry = 0;
				conf.NP = false;
				conf.mCarry = 0;
				conf.sCarry = 0;
				
		},

		lockInput: function(){
			var $this = this.config,
				newFocus;

			$this.displayContainer.on('focus', 'input', function(){
					newFocus = this.id;
					$this.autofocus = $this.display[newFocus];
					$(this).parents( 'section' ).siblings().find('.current').removeClass('current');
			});	
		},

		appendInput: function(){
			//This will append numbers to the input field
			$(this).parent().siblings().find('.current').removeClass('current');

			var $this = timeCalc.config,
				newInputValue; 

				newInputValue = ( $this.autofocus.val()-0 ) ? 
					$this.autofocus.val() + $(this).text() : $(this).text();
				
				$this.autofocus.val( newInputValue );

			
		},

		insertOperator : function(){
				var $this = timeCalc,
					op = $(this).text();
				$this.config.storeOperator.push( op );
				
				$('<li></li>',{
				class: 'eachOp',
				text: op
			}).hide().appendTo( $('div#roughColumn ul') ).fadeIn(100);
				
		},

		insertOperand : function(){
			var $this = this.config,
				tempHrs = ( $this.display['hrs'].val() ) ? parseInt( $this.display['hrs'].val() ) : 0 ,
				tempMins = ( $this.display['mns'].val() ) ? parseInt( $this.display['mns'].val() ) : 0 ,
				tempSecs = ( $this.display['secs'].val() ) ? parseInt( $this.display['secs'].val() ): 0 ;

				$this.storeHrs.push( tempHrs );
				$this.storeMins.push( tempMins );
				$this.storeSecs.push( tempSecs );

			

			$('<li></li>',{
				class: 'eachTime',
				text: tempHrs+"hrs :"+tempMins+"mins :"+tempSecs+"secs"
			}).hide().appendTo( $('div#roughColumn ul') ).fadeIn(100);
		},

		results: function(){
			var $this = timeCalc.config,
				results, operator = 0, previous,
				numOp = $this.storeOperator.length;
				
				$(this).parent().siblings().find('.current').removeClass('current');

				if ( numOp ) { 
					
					//when we pop operator then press '=', 0-0-0 is push to array. To prevent this 
					if ( $this.storeHrs.length == 0 || $this.storeHrs.length == $this.storeOperator.length ) {
						timeCalc.insertOperand();
					}

					 // if ( $this.storeHrs.length > numOp ) {
						results = timeCalc.calculation(); 	
					 // }
					
					
				 }
				
				if ( results ) {
					$this.display['hrs'].val( $this.hrs ) ;
					$this.display['mns'].val( $this.mins ) ;
					$this.display['secs'].val( $this.secs ) ;

					// $('<results></results>',{
					// 	class: 'timeResults',
					// 	text: $this.hrs+":"+$this.mins+":"+$this.secs
					// }).hide().appendTo( $('div#roughColumn') ).fadeIn(100);
					$('results').text( 
										($this.hrs > 1 ? $this.hrs+"hrs :" : $this.hrs+"hr :" )
										+($this.mins > 1 ? $this.mins+"mins :" : $this.mins+"min :" )
										+($this.secs > 1 ? $this.secs+"secs" : $this.secs+"sec" )
									);
				}
		},

		calculation: function () {
			var $this = timeCalc.config,
				op,hrsTop, hrsRunner, minsTop, minsRunner, 
				secsTop, secsRunner, size, i, resultsInMemory;

				

				size = $this.storeOperator.length;
			
			for( i=0; i<size; i++) {
			
				op = $this.storeOperator.shift();
				
				resultsInMemory = ( $this.hrs || $this.mins || $this.secs ) ? true : false;

				secsTop =  ( resultsInMemory ) ? $this.secs : ( $this.storeSecs.length ) ? parseInt( $this.storeSecs.shift() ) : 0;
				secsRunner = ( $this.storeSecs.length ) ? parseInt( $this.storeSecs.shift() ) : 0;
				$this.secs = ( op === '+' ) ? secsTop+secsRunner : secsTop-secsRunner;
				$this.pCarry = $this.secs / 60 ;
				$this.secs = ( $this.pCarry ) ? $this.secs % 60 : $this.secs;

			
				minsTop = ( resultsInMemory ) ? $this.mins : ( $this.storeMins.length ) ? parseInt( $this.storeMins.shift())  : 0;
				minsRunner = ( $this.storeMins.length ) ? parseInt( $this.storeMins.shift() )  : 0;
				$this.mins = ( op === '+' ) ? minsTop+minsRunner : minsTop-minsRunner;
				$this.mins = ( $this.pCarry ) ? parseInt( $this.mins )+parseInt( $this.pCarry ) : $this.mins;
				$this.pCarry = $this.mins / 60 ;
				$this.mins = ( $this.pCarry ) ? $this.mins % 60 : $this.mins;

				
				hrsTop = ( resultsInMemory ) ? $this.hrs : ( $this.storeHrs.length ) ? parseInt( $this.storeHrs.shift() ) : 0;
				hrsRunner = ( $this.storeHrs.length ) ? parseInt( $this.storeHrs.shift() ) : 0;
				$this.hrs = ( op === '+' ) ? hrsTop+hrsRunner : hrsTop-hrsRunner;
				$this.hrs = ( $this.pCarry ) ? parseInt( $this.hrs ) + parseInt( $this.pCarry ) : $this.hrs;
				$this.pCarry = 0;

				if ( op === '-' ) {
					
					( $this.hrs >= 0 ) ? ( $this.mins >= 0 ) ? $this.mCarry = 0 : $this.mCarry = 1 : $this.NP = true;
					
					if ( !$this.NP ) {
					
						( $this.secs >= 0 ) ? $this.sCarry = 0 : $this.sCarry = 1 ;
						
						$this.secs = ( $this.sCarry ) ? parseInt($this.secs)+60 : $this.secs ;
						$this.mins = ( $this.mCarry ) ? parseInt($this.mins)+60 : $this.mins ;

						$this.mins = ( $this.sCarry ) ? $this.mins-1 : $this.mins ;
						$this.hrs = ( $this.mCarry ) ? $this.hrs-1 : $this.hrs ;
			
						$this.sCarry = 0;
						$this.mCarry = 0;
						

						}
				}
				
			}

			$this.hrs = ( $this.NP ) ? 0 : $this.hrs ;
			$this.mins = ( $this.NP ) ? 0 : $this.mins ;
			$this.secs = ( $this.NP ) ? 0 : $this.secs ;
			
			
			return true;
			
		}


	};

	timeCalc.init({
		autofocus		: $('input#hrs'),
		clear 			: $('button#clear'),
		displayContainer: $('ul#displayUL'),
		display 		: {
							hrs : $('input#hrs'),
							mns: $('input#mns'),
							secs: $('input#secs')
						  },
		numberContainer : $('ul#numberUL'),
		op				: $('button.op'),
		results			: $('button#equals'),
		allClear		: $('button#allClear')
		
	});


})();