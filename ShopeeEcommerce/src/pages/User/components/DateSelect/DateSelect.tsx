import range from 'lodash/range'
import { useEffect, useState } from 'react'

interface DateSelectProps {
  errorMessage: string
  onChange?: (value: Date) => void
  value?: Date
}
export default function DateSelect({ onChange, errorMessage, value }: DateSelectProps) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>DOB</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange-500'
            onChange={handleChange}
            name='date'
            value={value?.getDate() || date.date}
          >
            <option disabled>Date</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange-500'
            onChange={handleChange}
            name='month'
            value={value?.getMonth() || date.month}
          >
            <option disabled>Month</option>
            {range(1, 13).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange-500'
            onChange={handleChange}
            name='year'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Year</option>
            {range(1990, 2024).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <div className='mt-1 text-red-600 min-h-[1.25rem] text-sm'>{errorMessage}</div>
        </div>
      </div>
    </div>
  )
}
