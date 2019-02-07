const URL = 'https://ssu6eonrqe.execute-api.eu-west-1.amazonaws.com/default/adapterCreator';
class Comm {
    static create(answers, cb) {
        try {
            fetch(URL, {
				method: 'POST',
				headers: {
					'Accept': 'application/zip',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(answers)
			})
				.then(response => response.body)
				.then(body => {
					// we have got the base64 string as answer
					const reader = body.getReader();
					return new ReadableStream({
						start(controller) {
							return pump();

							function pump() {
								return reader.read().then(({done, value}) => {
									// When no more data needs to be consumed, close the stream
									if (done) {
										controller.close();
										return;
									}
									// Enqueue the next data chunk into our target stream
									controller.enqueue(value);
									return pump();
								});
							}
						}
					})
				})
				.then(stream => new Response(stream))
				.then(response => response.blob())
				.then(blob => {
					// convert base64 string into blob
					const blb = new Blob([blob], {type: 'text/plain'});
					const reader = new FileReader();

					// This fires after the blob has been read/loaded.
					reader.addEventListener('loadend', e => {
						const text = e.srcElement.result;
						const url = 'data:application/zip;base64,' + text;

						fetch(url)
							.then(res => res.blob())
							.then(blob => cb && cb(null, blob))
								/*
								var url = window.URL.createObjectURL(blob);
								var a = document.createElement('a');
								a.href = url;
								a.download = "filename.zip";
								document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
								a.click();
								a.remove(); //afterwards we remove the element again
							})*/
					});

					// Start reading the blob as text.
					reader.readAsText(blb);
				})
				.catch(err => cb && cb(err));
        } catch (error) {
            cb && cb(error);
        }
    }

    static getAdapterNames(cb) {
		fetch('https://raw.githubusercontent.com/ioBroker/ioBroker.repositories/master/sources-dist.json')
			.then(res => res.json())
			.then(data => cb && cb(Object.keys(data)))
			.catch(e => console.error(e));
	}
}

export default Comm;
