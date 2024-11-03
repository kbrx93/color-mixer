'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ColorMixer() {
  const [color1, setColor1] = useState('#FF0000')
  const [color2, setColor2] = useState('#0000FF')
  const [opacity, setOpacity] = useState('0.50')
  const [result, setResult] = useState<string | null>(null)
  const [calculation, setCalculation] = useState<string | null>(null)

  const validateColor = (color: string) => {
    const hexPattern = /^#?[0-9A-Fa-f]{6}$/
    if (hexPattern.test(color)) {
      return color.startsWith('#') ? color : `#${color}`
    }
    return null
  }

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
  }

  const mixColors = (color1: string, color2: string, opacity: number) => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)
    const mixed = rgb1.map((c1, i) => Math.round(c1 * opacity + rgb2[i] * (1 - opacity)))
    return { mixed, rgb1, rgb2 }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validColor1 = validateColor(color1)
    const validColor2 = validateColor(color2)
    const validOpacity = parseFloat(opacity)

    if (!validColor1 || !validColor2) {
      alert('请输入有效的十六进制颜色代码 (例如: #FF0000 或 FF0000)')
      return
    }

    if (isNaN(validOpacity) || validOpacity < 0 || validOpacity > 1) {
      alert('请输入有效的透明度值 (0-1)')
      return
    }

    const { mixed, rgb1, rgb2 } = mixColors(validColor1, validColor2, validOpacity)
    const mixedColor = rgbToHex(...mixed as [number, number, number])
    setResult(mixedColor)

    const calcProcess = rgb1.map((c1, i) => {
      const c2 = rgb2[i]
      const m = mixed[i]
      return `${c1} * ${validOpacity.toFixed(2)} + ${c2} * ${(1 - validOpacity).toFixed(2)} = ${m}`
    })

    setCalculation(`
      计算公式: 结果 = 颜色1 * 透明度 + 颜色2 * (1 - 透明度)
      R: ${calcProcess[0]}
      G: ${calcProcess[1]}
      B: ${calcProcess[2]}
    `)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">颜色混合器</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="color1" className="block text-sm font-medium text-gray-700">
                颜色1 (HEX RGB):
              </label>
              <Input
                type="text"
                id="color1"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                placeholder="例如: #FF0000 或 FF0000"
                required
              />
            </div>
            <div>
              <label htmlFor="color2" className="block text-sm font-medium text-gray-700">
                颜色2 (HEX RGB):
              </label>
              <Input
                type="text"
                id="color2"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                placeholder="例如: #0000FF 或 0000FF"
                required
              />
            </div>
            <div>
              <label htmlFor="opacity" className="block text-sm font-medium text-gray-700">
                颜色1的透明度 (0-1):
              </label>
              <Input
                type="number"
                id="opacity"
                value={opacity}
                onChange={(e) => setOpacity(e.target.value)}
                min="0"
                max="1"
                step="0.01"
                required
              />
            </div>
            <Button type="submit">计算混合颜色</Button>
          </form>
        </CardContent>
      </Card>

      {result && calculation && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">混合结果</h3>
                <p>混合后的颜色: <strong>{result}</strong></p>
                <p>颜色1 ({validateColor(color1)}) 的透明度: {parseFloat(opacity).toFixed(2)}</p>
                <p>颜色2 ({validateColor(color2)}) 的透明度: {(1 - parseFloat(opacity)).toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">计算过程</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{calculation}</pre>
              </div>
              <div
                className="w-full h-24 rounded"
                style={{ backgroundColor: result }}
                aria-label="混合颜色预览"
              ></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}