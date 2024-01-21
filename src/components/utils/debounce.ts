const debounce = (callback: Function, time: number = 300) => {
  let timer: number

  return (...args: any) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      callback(...args)
    }, time)
  }
}

export { debounce }
