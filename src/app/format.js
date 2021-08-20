export const formatDate = (dateStr) => {
  try {
    if (Date.parse(dateStr) === NaN || dateStr === "") return "1 Jan. 01" //in case of invalid date
    const date = new Date(dateStr)
    const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
    const month = mo.charAt(0).toUpperCase() + mo.slice(1)
    return `${parseInt(da)} ${month.substr(0, 3)}. ${ye.toString().substr(2, 4)}`
  } catch (e) {
    return '';
  }
}

// export const formatDate = (dateStr) => {
//   const date = new Date(dateStr)
//   const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
//   const mo = new Intl.DateTimeFormat('fr', { month: '2-digit' }).format(date)
//   const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
//   const month = mo.charAt(0).toUpperCase() + mo.slice(1)
//   return `${(ye)}-${(mo)}-${(da)}`
// }

export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}