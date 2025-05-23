"use strict";exports.id=549,exports.ids=[549],exports.modules={549:(e,s,t)=>{t.d(s,{Z:()=>Sidebar});var r=t(784),i=t(9885),a=t(1440),o=t.n(a),l=t(7114),n=t(5105),c=t(647);let getSidebarNotifications=async e=>{try{let s=Date.now(),t=await fetch(`bigdealegypt.up.railway.app/api/notifications/sidebar?_t=${s}`,{method:"GET",headers:{Authorization:`Bearer ${e}`,"Cache-Control":"no-cache, no-store, must-revalidate",Pragma:"no-cache"},credentials:"include"});if(!t.ok){let e=await t.json();throw Error(e.error?.message||"Failed to fetch notifications")}let r=await t.json();return r.notifications}catch(e){return console.error("Get sidebar notifications error:",e),{propertyRequests:0,scheduledViewings:0,savedProperties:0,messages:0}}},d={getSidebarNotifications};function useSidebarNotifications(){let[e,s]=(0,i.useState)({propertyRequests:0,scheduledViewings:0,savedProperties:0,messages:0}),[t,r]=(0,i.useState)(!0),{user:a,session:o}=(0,c.a)();return(0,i.useEffect)(()=>{let fetchNotifications=async()=>{if(!a||!o?.access_token){r(!1);return}r(!0);try{let e=await d.getSidebarNotifications(o.access_token);s(e)}catch(e){console.error("Error fetching notification counts:",e),s({propertyRequests:0,scheduledViewings:0,savedProperties:0,messages:0})}finally{r(!1)}};fetchNotifications();let e=setInterval(fetchNotifications,12e4);return()=>{clearInterval(e)}},[a,o]),{notifications:e,loading:t}}let MenuItem=({href:e,icon:s,label:t,isActive:i,isCollapsed:a,hasNotification:l,notificationCount:n})=>(0,r.jsxs)(o(),{href:e,className:`
      flex items-center py-2.5 px-3 rounded-lg text-sm font-medium
      ${i?"bg-primary-50 text-primary-700":"text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
      ${a?"justify-center":""}
      transition-all duration-200
    `,children:[(0,r.jsxs)("div",{className:`${i?"text-primary-600":"text-gray-500"} relative`,children:[s,l&&!a&&r.jsx("span",{className:"absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full",children:n||""}),l&&a&&r.jsx("span",{className:"absolute -top-1 -right-1 bg-primary-600 w-2 h-2 rounded-full"})]}),!a&&r.jsx("span",{className:"ml-3",children:t}),!a&&l&&n&&r.jsx("span",{className:"ml-auto bg-primary-100 text-primary-700 text-xs px-1.5 py-0.5 rounded-full",children:n})]}),h=[{href:"/admin",icon:r.jsx(n.m6D,{size:20}),label:"Dashboard",role:"admin"},{href:"/admin/users",icon:r.jsx(n.WY8,{size:20}),label:"Users",role:"admin"},{href:"/admin/properties",icon:r.jsx(n.MIl,{size:20}),label:"Properties",role:"admin"},{href:"/admin/fields",icon:r.jsx(n.vPQ,{size:20}),label:"Form Fields",role:"admin"},{href:"/admin/analytics",icon:r.jsx(n.orK,{size:20}),label:"Analytics",role:"admin"}],m=[{href:"/sales-ops",icon:r.jsx(n.m6D,{size:20}),label:"Dashboard",role:"sales_ops"},{href:"/sales-ops/properties",icon:r.jsx(n.MIl,{size:20}),label:"Properties",role:"sales_ops"},{href:"/sales-ops/requests",icon:r.jsx(n.SnF,{size:20}),label:"Customer Requests",role:"sales_ops",hasNotification:!0},{href:"/sales-ops/scheduled-viewings",icon:r.jsx(n.vlc,{size:20}),label:"Viewings",role:"sales_ops",hasNotification:!0},{href:"/sales-ops/messages",icon:r.jsx(n.EQ9,{size:20}),label:"Messages",role:"sales_ops",hasNotification:!0}],f=[{href:"/dashboard",icon:r.jsx(n.m6D,{size:20}),label:"Dashboard",role:"customer"},{href:"/dashboard/property-requests",icon:r.jsx(n.SnF,{size:20}),label:"Property Requests",role:"customer",hasNotification:!0},{href:"/dashboard/scheduled-viewings",icon:r.jsx(n.vlc,{size:20}),label:"Scheduled Viewings",role:"customer",hasNotification:!0},{href:"/dashboard/saved-properties",icon:r.jsx(n.l1M,{size:20}),label:"Saved Properties",role:"customer",hasNotification:!0},{href:"/dashboard/activity",icon:r.jsx(n.TCC,{size:20}),label:"Activity History",role:"customer"}],p=[{href:"/",icon:r.jsx(n.m6D,{size:20}),label:"Home",role:""},{href:"/properties",icon:r.jsx(n.m6D,{size:20}),label:"Properties",role:""},{href:"/about",icon:r.jsx(n.H33,{size:20}),label:"About",role:""},{href:"/contact",icon:r.jsx(n.EQ9,{size:20}),label:"Contact",role:""}];function Sidebar({isCollapsed:e,toggleSidebar:s,sidebarType:t="customer"}){let i;let a=(0,l.usePathname)(),{user:d,role:u,signOut:x}=(0,c.a)(),{notifications:b,loading:g}=useSidebarNotifications(),y=(i=[],"admin"===u?i=h:"sales_ops"===u?i=m:"customer"===u&&(i=f),i.concat(p.filter(e=>!a.startsWith("/admin")&&!a.startsWith("/sales-ops")&&!a.startsWith("/dashboard")))),j=(()=>{let e="admin"===u?{href:"/admin/settings",icon:r.jsx(n.nbt,{size:20}),label:"Settings",role:"admin"}:"sales_ops"===u?{href:"/sales-ops/settings",icon:r.jsx(n.nbt,{size:20}),label:"Settings",role:"sales_ops"}:{href:"/dashboard/settings",icon:r.jsx(n.nbt,{size:20}),label:"Settings",role:"customer"},s={href:"/help",icon:r.jsx(n.bax,{size:20}),label:"Help & Support",role:""};return[e,s]})(),v=y.map(e=>{if(!e.hasNotification)return e;let s=0;return e.href.includes("property-requests")||e.href.includes("requests")?s=b.propertyRequests||0:e.href.includes("scheduled-viewings")||e.href.includes("viewings")?s=b.scheduledViewings||0:e.href.includes("saved-properties")?s=b.savedProperties||0:e.href.includes("messages")&&(s=b.messages||0),{...e,hasNotification:s>0,notificationCount:s}});return(0,r.jsxs)("div",{className:"h-full bg-white overflow-y-auto overflow-x-hidden border-r border-gray-200 shadow-sm",children:[(0,r.jsxs)("div",{className:`flex items-center ${e?"justify-center":"px-4"} h-16 border-b border-gray-200`,children:[!e&&(0,r.jsxs)(o(),{href:"/",className:"flex items-center",children:[r.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm",children:"BD"}),r.jsx("span",{className:"ml-2 text-xl font-semibold text-gray-900 transition-opacity",children:"BigDealEgypt"})]}),r.jsx("button",{onClick:s,className:`
            p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors
            ${e?"ml-0 mt-2":"ml-auto"}
          `,"aria-label":e?"Expand sidebar":"Collapse sidebar",children:e?r.jsx(n.Tfp,{size:16}):r.jsx(n.YFh,{size:16})})]}),r.jsx("div",{className:`border-b border-gray-200 flex ${e?"justify-center py-4":"px-4 py-3"}`,children:e?r.jsx("div",{className:"w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-medium text-lg",children:d?.name?.charAt(0).toUpperCase()||"U"}):(0,r.jsxs)(r.Fragment,{children:[r.jsx("div",{className:"w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-medium text-lg",children:d?.name?.charAt(0).toUpperCase()||"U"}),(0,r.jsxs)("div",{className:"ml-3 overflow-hidden",children:[r.jsx("p",{className:"text-sm font-medium text-gray-900 truncate",children:d?.name||"User Account"}),r.jsx("p",{className:"text-xs text-gray-500 truncate",children:"admin"===u?"Administrator":"sales_ops"===u?"Sales Agent":"Customer"})]})]})}),r.jsx("div",{className:`flex-1 overflow-y-auto py-4 ${e?"px-2":"px-3"}`,children:r.jsx("nav",{className:"space-y-1",children:v.map(s=>r.jsx(MenuItem,{href:s.href,icon:s.icon,label:s.label,isActive:a===s.href||a.startsWith(`${s.href}/`),isCollapsed:e,hasNotification:s.hasNotification,notificationCount:s.notificationCount},s.href))})}),r.jsx("div",{className:`border-t border-gray-200 py-4 ${e?"px-2":"px-3"}`,children:(0,r.jsxs)("nav",{className:"space-y-1",children:[j.map(s=>r.jsx(MenuItem,{href:s.href,icon:s.icon,label:s.label,isActive:a===s.href,isCollapsed:e,hasNotification:!1,notificationCount:0},s.href)),(0,r.jsxs)("button",{onClick:async e=>{e.preventDefault(),e.stopPropagation(),console.log("Logout button clicked in Sidebar");try{await x()}catch(e){console.error("Sidebar logout error:",e),window.location.href="/"}},className:`
              w-full flex items-center py-2.5 px-3 rounded-lg text-sm font-medium
              text-red-600 hover:bg-red-50
              ${e?"justify-center":""}
              transition-all duration-200
            `,children:[r.jsx(n.xqh,{size:20,className:"text-red-500"}),!e&&r.jsx("span",{className:"ml-3",children:"Sign out"})]})]})})]})}}};