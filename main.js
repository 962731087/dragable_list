import './style.css'
;(() => {
	const list = [111, 222, 333, 444, 555, 666]

	function init() {
		render()
		bindEvent()
	}

	function render() {
		const ul = document.createElement('ul')
		ul.className = 'dragable-list-wrapper'
		list.forEach((item, index) => {
			const li = document.createElement('li')
			li.className = 'dragable-list-item'
			li.setAttribute('data-index', index)
			li.textContent = item
			li.draggable = true
			ul.appendChild(li)
		})
		document.querySelector('#app').appendChild(ul)
	}

	function bindEvent() {
		const ul = document.querySelector('.dragable-list-wrapper')
		const lis = document.querySelectorAll('.dragable-list-item')

		ul.addEventListener('dragover', handleDragover)

		lis.forEach(item => {
			item.addEventListener('dragstart', handleDragstart)
			item.addEventListener('dragend', handleDragend)
		})
	}

	function handleDragstart(e) {
		// 创建拖动图像的div元素
		var dragImgContainer = document.createElement('div')
		dragImgContainer.style.position = 'absolute'
		dragImgContainer.style.top = '-9999px'
		dragImgContainer.style.left = '-9999px'
		document.body.appendChild(dragImgContainer)

		// 创建副本并添加到div元素中
		var dragImg = this.cloneNode(true)
		dragImgContainer.appendChild(dragImg)

		// 设置拖动图像
		e.dataTransfer.setDragImage(dragImgContainer, 0, 0)

		requestAnimationFrame(() => {
			this.classList.add('dragging')
			dragImgContainer.parentNode.removeChild(dragImgContainer)
		})
	}

	function handleDragend(e) {
		e.preventDefault()
		this.classList.remove('dragging')
	}

	function handleDragover(e) {
		e.preventDefault()
		const targetLi = e.target.closest('li')
		// 当移出当前元素是进行排序操作
		if(targetLi !== e.target){
			const dragItem = document.querySelector('.dragging')
			const listItems = document.querySelectorAll('.dragable-list-item')

			let flag = false
			for (let index = 0; index < listItems.length; index++) {
				const element = listItems[index]
				const info = element.getBoundingClientRect()
				const offsetY = info.y + info.height / 2
				const moveY = e.y
				
				if (moveY < offsetY) {
					element.parentNode.insertBefore(dragItem, element)
					flag = true
					break
				}
			}
			// 处理无法拖动到最后的问题
			if (!flag && dragItem.nextSibling) {
				dragItem.parentNode.insertBefore(dragItem, null)
			}
			const newList = [...listItems].map(item => item.textContent)
		}
	}
	init()
})()
