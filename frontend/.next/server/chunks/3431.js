"use strict";exports.id=3431,exports.ids=[3431],exports.modules={3431:(e,r,d)=>{d.d(r,{Z:()=>Card});var a=d(784);function Card({children:e,className:r="",padding:d="small",shadow:o="small",rounded:s="medium",border:n=!1,hover:l=!1,clickable:i=!1}){return a.jsx("div",{className:`
        bg-white
        ${{none:"p-0",xs:"p-2",small:"p-3",medium:"p-4",large:"p-5"}[d]}
        ${{none:"",small:"shadow-sm",medium:"shadow",large:"shadow-lg"}[o]}
        ${{none:"rounded-none",small:"rounded-md",medium:"rounded-lg",large:"rounded-xl"}[s]}
        ${n?"border border-gray-100":""}
        ${l?"transition-all duration-200 hover:shadow-md hover:translate-y-[-1px]":""}
        ${i?"cursor-pointer active:scale-[0.99] active:shadow-inner transition-transform":""}
        ${r}
      `,children:e})}d(9885)}};