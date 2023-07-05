const checkAnimationAPISupport = () => {
	if (document.startViewTransition) {
		return true
	}
	console.log('Web Transitions API not supported.')
	return false
}

const fetchPage = async (url) => {
	const response = await fetch(url)
	const text = await response.text()

	const [, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)
	return data
}

export const startNavigationTransition = () => {
	if (checkAnimationAPISupport()) {
		window.navigation.addEventListener('navigate', (event) => {
			const destinationURL = new URL(event.destination.url)
			if (location.origin !== destinationURL.origin) return
			event.intercept({
				async handler () {
					const data = await fetchPage(destinationURL.pathname)
					document.startViewTransition(() => {
						console.log(data);
						document.body.innerHTML = data
						document.documentElement.scrollTop = 0
					})
				}
			})
		})
	}
}