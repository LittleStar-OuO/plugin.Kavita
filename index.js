 const userConfig = window.Rulia.getUserConfig()
let baseUrl = userConfig.baseUrl;
let apiKey = userConfig.apiKey;
let authorization = userConfig.authorization;

async function setMangaListFilterOptions() {
	try {
		let result = [{
			label: 'Navigation',
			name: 'filter_navigation_id',
			options: [{
					label: 'All Series',
					value: 0
				},
				{
					label: 'On Deck',
					value: 1
				},
				{
					label: 'Recently Updated Series',
					value: 2
				},
				{
					label: 'Newly Added Series',
					value: 3
				}
			]
		}]
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}


async function getMangaListByNavigationId(page, pageSize, filterOptions) {
	try {
		if (filterOptions.filter_navigation_id == 1) {
			// On Deck & 最近阅读
			let rawResponse = await window.Rulia.httpRequest({
				url: baseUrl + '/api/series/on-deck?libraryId=0&pageNumber=' + page
					.toString() +
					'&pageSize=' + pageSize.toString(),
				method: 'POST',
				contentType: 'application/json',
				headers: {
					authorization: authorization
				}
			});
			const response = JSON.parse(rawResponse);
			let result = {
				list: []
			}
			for (manga of response) {
				result.list.push({
					title: manga.name,
					url: baseUrl + '/library/' + manga.libraryId + '/series/' + manga.id +
						'#specials-tab',
					coverUrl: baseUrl + '/api/image/series-cover?seriesId=' + manga.id +
						'&apiKey=' + apiKey
				});
			}
			window.Rulia.endWithResult(result);
		} else if (filterOptions.filter_navigation_id == 2) {
			// Recently Updated Series & 最近更新
			let rawResponse = await window.Rulia.httpRequest({
				url: baseUrl + '/api/series/all-v2?PageNumber=' + page
					.toString() + '&PageSize=' + pageSize.toString(),
				method: 'POST',
				payload: JSON.stringify({
					"id": 0,
					"name": "",
					"statements": [{
						"comparison": 0,
						"field": 1,
						"value": ""
					}],
					"combination": 1,
					"sortOptions": {
						"sortField": 3,
						"isAscending": false
					},
					"limitTo": 0
				}),
				contentType: 'application/json',
				headers: {
					authorization: authorization
				}
			});
			const response = JSON.parse(rawResponse);
			let result = {
				list: []
			}
			for (manga of response) {
				result.list.push({
					title: manga.name,
					url: baseUrl + '/library/' + manga.libraryId + '/series/' + manga.id +
						'#specials-tab',
					coverUrl: baseUrl + '/api/image/series-cover?seriesId=' + manga.id +
						'&apiKey=' + apiKey
				});
			}
			window.Rulia.endWithResult(result);
		} else if (filterOptions.filter_navigation_id == 3) {
			// Newly Added Series & 最新上架
			let rawResponse = await window.Rulia.httpRequest({
				url: baseUrl + '/api/series/recently-added-v2?pageNumber=' + page
					.toString() + '&PageSize=' + pageSize.toString(),
				method: 'POST',
				contentType: 'application/json',
				payload: JSON.stringify({}),
				headers: {
					authorization: authorization
				}
			});
			const response = JSON.parse(rawResponse);
			let result = {
				list: []
			}
			for (manga of response) {
				result.list.push({
					title: manga.name,
					url: baseUrl + '/library/' + manga.libraryId + '/series/' + manga.id +
						'#specials-tab',
					coverUrl: baseUrl + '/api/image/series-cover?seriesId=' + manga.id +
						'&apiKey=' + apiKey
				});
			}
			window.Rulia.endWithResult(result);
		} else {
			// All Series & 全部系列
			let rawResponse = await window.Rulia.httpRequest({
				url: baseUrl + '/api/series/all-v2?PageNumber=' + page.toString() +
					'&PageSize=' + pageSize.toString(),
				method: 'POST',
				contentType: 'application/json',
				payload: JSON.stringify({
					"id": 0,
					"name": null,
					"statements": [{
						"comparison": 0,
						"field": 1,
						"value": ""
					}],
					"combination": 1,
					"sortOptions": {
						"sortField": 1,
						"isAscending": true
					},
					"limitTo": 0
				}),
				headers: {
					authorization: authorization
				}
			});
			const response = JSON.parse(rawResponse);
			let result = {
				list: []
			}
			for (manga of response) {
				result.list.push({
					title: manga.name,
					url: baseUrl + '/library/' + manga.libraryId + '/series/' + manga.id +
						'#specials-tab',
					coverUrl: baseUrl + '/api/image/series-cover?seriesId=' + manga.id +
						'&apiKey=' + apiKey
				});
			}
			window.Rulia.endWithResult(result);
		}
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}

async function getMangaListByKeyWord(page, pageSize, keyword) {
	try {
		let rawResponse = await window.Rulia.httpRequest({
			url: baseUrl + '/api/series/all-v2?PageNumber=' + page.toString() +
				'&PageSize=' + pageSize.toString(),
			method: 'POST',
			contentType: 'application/json',
			payload: JSON.stringify({
				"statements": [{
					"comparison": 7,
					"value": keyword,
					"field": 1
				}],
				"combination": 1,
				"limitTo": 0,
				"sortOptions": {
					"isAscending": true,
					"sortField": 1
				}
			}),
			headers: {
				authorization: authorization
			}
		});
		const response = JSON.parse(rawResponse);
		let result = {
			list: []
		}
		for (manga of response) {
			result.list.push({
				title: manga.name,
				url: baseUrl + '/library/' + manga.libraryId + '/series/' + manga.id +
					'#specials-tab',
				coverUrl: baseUrl + '/api/image/series-cover?seriesId=' + manga.id +
					'&apiKey=' + apiKey
			});
		}
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}

async function getMangaList(page, pageSize, keyword, rawFilterOptions) {
	if (keyword) {
		return await getMangaListByKeyWord(page, pageSize, keyword);
	} else {
		return await getMangaListByNavigationId(page, pageSize, JSON.parse(rawFilterOptions));
	}
}

async function getMangaData(dataPageUrl) {
	const match = dataPageUrl.match(/\/series\/(\d+)/);
	let id = match ? match[1] : null;
	try {
		let titleRawResponse = await window.Rulia.httpRequest({
			url: baseUrl + '/api/series/' + id,
			method: 'GET',
			contentType: 'application/json',
			headers: {
				authorization: authorization
			}
		});
		const titleResponse = JSON.parse(titleRawResponse);

		let metaRawResponse = await window.Rulia.httpRequest({
			url: baseUrl + '/api/series/metadata?seriesId=' + id,
			method: 'GET',
			contentType: 'application/json',
			headers: {
				authorization: authorization
			}
		});
		const metaResponse = JSON.parse(metaRawResponse);

		let chaptersRawResponse = await window.Rulia.httpRequest({
			url: baseUrl + '/api/series/series-detail?seriesId=' + id,
			method: 'GET',
			contentType: 'application/json',
			headers: {
				authorization: authorization
			}
		});
		const chaptersResponse = JSON.parse(chaptersRawResponse);

		let writers = '';
		if (metaResponse.writers.length != 0) {
			for (let i = 0; i < metaResponse.writers.length; i++) {
				if (i == 0) {
					writers += '[Writers:'
				} else {
					writers += '、'
				}
				writers += metaResponse.writers[i].name
				if (i == (metaResponse.writers.length - 1)) {
					writers += ']'
				}
			}
		}

		let genres = '';
		if (metaResponse.genres.length != 0) {
			for (let i = 0; i < metaResponse.genres.length; i++) {
				if (i == 0) {
					genres += '[Genres:'
				} else {
					genres += '、'
				}
				genres += metaResponse.genres[i].title
				if (i == (metaResponse.genres.length - 1)) {
					genres += ']'
				}
			}
		}

		let tags = '';
		if (metaResponse.tags.length != 0) {
			for (let i = 0; i < metaResponse.tags.length; i++) {
				if (i == 0) {
					tags += '[Tags:'
				} else {
					tags += '、'
				}
				tags += metaResponse.tags[i].title
				if (i == (metaResponse.tags.length - 1)) {
					tags += ']'
				}
			}
		}

		let releaseYear = '';
		if (metaResponse.releaseYear != 0 && metaResponse.releaseYear != null) {
			releaseYear = '[ReleaseYear:' + metaResponse.releaseYear + ']';
		}

		let result = {
			title: titleResponse.name,
			description: writers + genres + tags + releaseYear,
			coverUrl: baseUrl + '/api/image/series-cover?seriesId=' + id +
				'&apiKey=' + apiKey,
			chapterList: []
		}

		if (chaptersResponse.specials.length != 0) {
			for (chapter of chaptersResponse.specials) {
				if (chapter.files[0].format == 1) {
					result.chapterList.push({
						title: chapter.title,
						url: baseUrl + '/library/' + titleResponse.libraryId + '/series/' + id +
							'/chapter/' + chapter.id
					})
				} else {
					result.description =
						'[Note: Due to force majeure, this comic is currently not supported for reading in Rulia Reader.]' +
						result.description;
				}
			}
		} else {
			result.description =
				'[Note: Due to force majeure, this comic is currently not supported for reading in Rulia Reader.]' +
				result.description;
		}
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}

async function getChapterImageList(chapterUrl) {
	const match = chapterUrl.match(/chapter\/(\d+)/);
	let id = match ? match[1] : null;
	try {
		let rawResponse = await window.Rulia.httpRequest({
			url: baseUrl + '/api/chapter?chapterId=' + id,
			method: 'GET',
			contentType: 'application/json',
			headers: {
				authorization: authorization
			}
		});
		const response = JSON.parse(rawResponse);
		let result = [];
		for (let i = 0; i < response.pages; i++) {
			result.push({
				url: baseUrl +
					'/api/reader/image?chapterId=' + id +
					'&apiKey=e6082d60-a694-4226-8f99-eefca2edeed1&page=' + i,
				width: 1,
				height: 1
			})
		}
		window.Rulia.endWithResult(result);
	} catch (error) {
		window.Rulia.endWithException(error.message);
	}
}

async function getImageUrl(path) {
	window.Rulia.endWithResult(path);
}