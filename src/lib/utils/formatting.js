export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(date)
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
