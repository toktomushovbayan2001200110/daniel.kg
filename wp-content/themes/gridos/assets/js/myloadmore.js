jQuery(function($){ // use jQuery code inside this to avoid "$ is not defined" error
	$('.gridos_loadmore').click(function(){

		var button = $(this),
			layoutPost = $(this).attr('data-layout'),
			postsNumber = $(this).attr('data-post-num'),
			postsOrder = $(this).attr('data-order'),
			postsCategory = $(this).attr('data-category'),
			postsTags = $(this).attr('data-tag'),
			postsComment = $(this).attr('data-comment'),
			postsPopular = $(this).attr('data-popular'),
			postsCustom = $(this).attr('data-custom'),
			data = {
				'action': 'loadmore',
				'query': gridos_loadmore_params.posts, // that's how we get params from wp_localize_script() function
				'page' : gridos_loadmore_params.current_page,
				'layoutPost' : layoutPost,
				'postsNumber' : postsNumber,
				'postsOrder' : postsOrder,
				'postsCategory' : postsCategory,
				'postsTags' : postsTags,
				'postsComment' : postsComment,
				'postsPopular' : postsPopular,
				'postsCustom' : postsCustom
			};
 
		$.ajax({ // you can also use $.post here
			url : gridos_loadmore_params.ajaxurl, // AJAX handler
			data : data,
			type : 'POST',
			beforeSend : function ( xhr ) {
				button.text('Loading...'); // change the button text, you can also add a preloader image
			},
			success : function( data ){
				if( data ) { 
					button.text( 'More posts' );
					var storage = document.createElement('div');
					var $elems;
					$(storage).append( data );
					
					$elems = $(storage).find('.item').appendTo('.iso-call');
					$('.recent-box.iso-call').isotope( 'appended', $elems );
					gridos_loadmore_params.current_page++;
 
					if ( data.length < 5 ) {

						button.remove(); // if last page, remove the button
 
						// you can also fire the "post-load" event here if you use a plugin that requires it
						// $( document.body ).trigger( 'post-load' );
					}
						
				} else {
					button.remove(); // if no data, remove the button as well
				}
			}
		});
	});

	var canBeLoaded = false, // this param allows to initiate the AJAX call only if necessary
		bottomOffset = 2000; // the distance (in px) from the page bottom when you want to load more posts
		
	if( $('.gridos_loadmore').hasClass('infinite-box') ) {
		canBeLoaded = true;
		var layoutPost = $('.infinite-box').attr('data-layout'),
		postsNumber = $('.infinite-box').attr('data-post-num'),
		postsOrder = $('.infinite-box').attr('data-order'),
		postsCategory = $('.infinite-box').attr('data-category'),
		postsTags = $('.infinite-box').attr('data-tag'),
		postsComment = $('.infinite-box').attr('data-comment'),
		postsPopular = $('.infinite-box').attr('data-popular'),
		postsCustom = $('.infinite-box').attr('data-custom');
	}

	$(window).scroll(function(){
		var data = {
			'action': 'loadmore',
			'query': gridos_loadmore_params.posts,
			'page' : gridos_loadmore_params.current_page,
			'layoutPost' : layoutPost,
			'postsNumber' : postsNumber,
			'postsOrder' : postsOrder,
			'postsCategory' : postsCategory,
			'postsTags' : postsTags,
			'postsComment' : postsComment,
			'postsPopular' : postsPopular,
			'postsCustom' : postsCustom
		};
		if( $(document).scrollTop() > ( $(document).height() - bottomOffset ) && canBeLoaded == true ){
			$.ajax({
				url : gridos_loadmore_params.ajaxurl,
				data:data,
				type:'POST',
				beforeSend: function( xhr ){
					// you can also add your own preloader here
					// you see, the AJAX call is in process, we shouldn't run it again until complete
					canBeLoaded = false; 
				},
				success:function(data){
					if( data ) {
						var storage = document.createElement('div');
						var $elems;
						$(storage).append( data );
						
						$elems = $(storage).find('.item').appendTo('.iso-call');
						$('.recent-box.iso-call').isotope( 'appended', $elems );
						canBeLoaded = true; // the ajax is completed, now we can run it again
						gridos_loadmore_params.current_page++;
					}
				}
			});
		}
	});
});