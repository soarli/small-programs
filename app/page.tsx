'use client'

import { useState, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const convertToChineseUppercase = (num: number): string => {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟']
    const decimalUnits = ['角', '分']
    
    const convertInteger = (n: number): string => {
      if (n === 0) return digits[0]
      
      let result = ''
      let unitPos = 0
      let strNum = Math.floor(n).toString()
      
      for (let i = strNum.length - 1; i >= 0; i--) {
        let digit = parseInt(strNum[i])
        if (digit !== 0) {
          if (unitPos % 4 === 0 && unitPos > 3) {
            result = units[4] + result
          }
          if (digit !== 1 || unitPos % 4 !== 1 || unitPos > 4 || strNum.length >= 3) {
            result = digits[digit] + units[unitPos % 4] + result
          } else {
            result = units[unitPos % 4] + result
          }
        } else if (i === strNum.length - 1 || unitPos % 8 === 4) {
          result = digits[digit] + result
        }
        unitPos++
      }
      
      result = result.replace(/零+/g, '零').replace(/零+$/, '')
      return result
    }

    const convertDecimal = (n: number): string => {
      let result = ''
      let strDecimal = n.toString().split('.')[1] || ''
      for (let i = 0; i < 2; i++) {
        if (strDecimal[i]) {
          let digit = parseInt(strDecimal[i])
          if (digit !== 0) {
            result += digits[digit] + decimalUnits[i]
          }
        }
      }
      return result
    }

    let integerPart = Math.floor(num)
    let decimalPart = num - integerPart

    let result = ''
    if (integerPart > 0) {
      result += convertInteger(integerPart) + '元'
      if (decimalPart === 0) {
        result += '整'
      }
    }

    if (decimalPart > 0) {
      result += convertDecimal(num)
    }

    return result || '零元整'
  }

  const handleConvert = () => {
    const number = parseFloat(input)
    if (isNaN(number)) {
      setResult('请输入有效的数字')
    } else {
      setResult(convertToChineseUppercase(number))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>数字转汉字大写（含小数）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="请输入数字（可包含小数）"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleConvert}>转换</Button>
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">
              结果: <span className="text-primary">{result}</span>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(result);
                // 可以添加一个提示，表示复制成功
              }}
            >
              复制结果
            </Button>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500 text-center">
          出自soarli创意设计
        </div>
      </CardContent>
    </Card>
  )
}
