"use strict";exports.id=2522,exports.ids=[2522],exports.modules={2522:(r,e,t)=>{t.d(e,{Z:()=>Button});var a=t(784);t(9885);var o=t(1440),i=t.n(o);function LoadingSpinner({size:r="medium",color:e="primary",className:t=""}){return a.jsx("div",{className:`flex justify-center items-center ${t}`,children:a.jsx("div",{className:`
          rounded-full
          animate-spin
          ${{small:"h-4 w-4 border-2",medium:"h-8 w-8 border-2",large:"h-12 w-12 border-3"}[r]}
          ${{primary:"border-primary-300 border-t-primary",white:"border-gray-200 border-t-white",gray:"border-gray-200 border-t-gray-600"}[e]}
        `})})}function Button({children:r,variant:e="primary",size:t="md",fullWidth:o=!1,href:s,loading:d=!1,outline:b=!1,rounded:g=!0,glass:n=!1,animation:m="none",className:l="",leftIcon:h,rightIcon:y,...x}){let p=x.disabled?"opacity-60 cursor-not-allowed":"transform active:scale-[0.98] transition-transform",c=`
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${{primary:b?"border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100":"bg-primary-600 hover:bg-primary-700 text-white shadow-sm",secondary:b?"border-2 border-gray-400 text-gray-700 hover:bg-gray-50 active:bg-gray-100":"bg-gray-600 hover:bg-gray-700 text-white shadow-sm",success:b?"border-2 border-green-500 text-green-600 hover:bg-green-50 active:bg-green-100":"bg-green-600 hover:bg-green-700 text-white shadow-sm",danger:b?"border-2 border-red-500 text-red-600 hover:bg-red-50 active:bg-red-100":"bg-red-600 hover:bg-red-700 text-white shadow-sm",warning:b?"border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100":"bg-amber-500 hover:bg-amber-600 text-white shadow-sm",info:b?"border-2 border-blue-400 text-blue-500 hover:bg-blue-50 active:bg-blue-100":"bg-blue-500 hover:bg-blue-600 text-white shadow-sm",light:b?"border-2 border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100":"bg-gray-100 hover:bg-gray-200 text-gray-800",dark:b?"border-2 border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white":"bg-gray-800 hover:bg-gray-900 text-white shadow-sm",outline:"border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 bg-white",gradient:"bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm"}[e]}
    ${{xs:"text-xs px-2.5 py-1.5 gap-1",sm:"text-sm px-3 py-2 gap-1.5",md:"text-base px-4 py-2.5 gap-2",lg:"text-lg px-5 py-3 gap-2",xl:"text-xl px-6 py-3.5 gap-2.5"}[t]}
    ${o?"w-full":""}
    ${g?"rounded-full":"rounded-lg"}
    ${n?"backdrop-blur-sm bg-opacity-80 shadow-sm":""}
    ${{none:"",pulse:"animate-pulse",bounce:"animate-bounce"}[m]}
    ${p}
    ${l}
  `;return s?(0,a.jsxs)(i(),{href:s,className:c,children:[h&&a.jsx("span",{className:"flex items-center",children:h}),r,y&&a.jsx("span",{className:"flex items-center",children:y})]}):(0,a.jsxs)("button",{className:c,disabled:d||x.disabled,...x,children:[d?a.jsx(LoadingSpinner,{size:"small",color:b?"primary":"white"}):h?a.jsx("span",{className:"flex items-center",children:h}):null,a.jsx("span",{children:r}),y&&!d&&a.jsx("span",{className:"flex items-center",children:y})]})}}};