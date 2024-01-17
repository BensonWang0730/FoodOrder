const debounce = (callback: Function, time: number = 500) => {
  let timer: number

  return (...args: any) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      callback(...args)
    }, time)
  }
}

export { debounce }
