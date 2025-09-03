import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

// Phone mask: (99) 99999-9999
const phoneMask = (value) => {
  if (!value) return value
  
  const phoneNumber = value.replace(/[^\d]/g, '')
  const phoneNumberLength = phoneNumber.length
  
  if (phoneNumberLength < 3) return phoneNumber
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`
}

// CPF mask: 999.999.999-99
const cpfMask = (value) => {
  if (!value) return value
  
  const cpf = value.replace(/[^\d]/g, '')
  const cpfLength = cpf.length
  
  if (cpfLength < 4) return cpf
  if (cpfLength < 7) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`
  }
  if (cpfLength < 10) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`
  }
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`
}

// Weight mask: 999.9
const weightMask = (value) => {
  if (!value) return value
  
  // Remove non-numeric characters except dots
  let weight = value.replace(/[^\d.]/g, '')
  
  // Ensure only one dot
  const parts = weight.split('.')
  if (parts.length > 2) {
    weight = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit to 3 digits before dot and 1 after
  if (parts.length === 2) {
    weight = parts[0].slice(0, 3) + '.' + parts[1].slice(0, 1)
  } else {
    weight = weight.slice(0, 3)
  }
  
  return weight
}

// Height mask: 999.9
const heightMask = (value) => {
  if (!value) return value
  
  // Remove non-numeric characters except dots
  let height = value.replace(/[^\d.]/g, '')
  
  // Ensure only one dot
  const parts = height.split('.')
  if (parts.length > 2) {
    height = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit to 3 digits before dot and 1 after
  if (parts.length === 2) {
    height = parts[0].slice(0, 3) + '.' + parts[1].slice(0, 1)
  } else {
    height = height.slice(0, 3)
  }
  
  return height
}

const masks = {
  phone: phoneMask,
  cpf: cpfMask,
  weight: weightMask,
  height: heightMask,
}

const MaskedInput = forwardRef(({ className, type, mask, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    if (mask && masks[mask]) {
      const maskedValue = masks[mask](e.target.value)
      e.target.value = maskedValue
    }
    onChange?.(e)
  }

  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  )
})

MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }
