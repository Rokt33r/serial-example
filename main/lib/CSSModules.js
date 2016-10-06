import CSSModules from 'react-css-modules'

const opts = {
  allowMultiple: true,
  errorWhenNotFound: false
}

export default function (component, styles) {
  return CSSModules(component, styles, opts)
}
