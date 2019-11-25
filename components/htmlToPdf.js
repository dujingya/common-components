import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install(Vue) {
    Vue.prototype.getPdf = function(DOM, name) {
      var mainRight = document.getElementById(DOM)  // 不带分页的导出pdf
      html2Canvas(mainRight, {
        allowTaint: true,
        dpi: window.devicePixelRatio * 10,
        scale: 2 // 提升画面质量，但是会增加文件大小
      }).then(function(canvas) {
        var contentWidth = canvas.width
        var contentHeight = canvas.height

        var pageData = canvas.toDataURL('image/jpeg', 1.0)

        var pdfWidth = contentWidth / 2 * 0.75
        var pdfHeight = (contentHeight + 100) / 2 * 0.75 // 500为底部留白

        var imgWidth = pdfWidth - 10
        var imgHeight = (contentHeight / 2 * 0.75) // 内容图片这里不需要留白的距离

        var pdf = new JsPDF('', 'pt', [pdfWidth, pdfHeight])
        pdf.addImage(pageData, 'jpeg', 0, 0, imgWidth, imgHeight)
        pdf.save(`${name}` + '.pdf')
      })
    }
  }
}
