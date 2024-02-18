import * as XLSX from 'xlsx'

export const convertToExcel = async (headers, data) => {
  // 시트 생성
  const worksheet = XLSX.utils.json_to_sheet(data, { header: headers })

  // 헤더 예제 : [apple, banana]
  // 데이터 예제 : [{apple: 1, banana: 2}, {apple: 3, banana: 4}]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  // 버퍼로 변환
  const buf = await XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

  return buf
}
