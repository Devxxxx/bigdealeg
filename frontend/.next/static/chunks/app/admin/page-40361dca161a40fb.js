(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3],{1636:function(e,r,n){Promise.resolve().then(n.bind(n,5804))},5804:function(e,r,n){"use strict";n.r(r),n.d(r,{default:function(){return AdminDashboard}});var l=n(7437),c=n(2265),d=n(5243),h=n(2595),f=n(4734),g=n(8611),y=n(8920),b=n(1396),v=n.n(b),N=n(1949),w=n(5925);function AdminDashboard(){let{user:e,session:r}=(0,d.a)(),[n,b]=(0,c.useState)(null),[_,E]=(0,c.useState)(!0);(0,c.useEffect)(()=>{let fetchDashboardData=async()=>{try{if(E(!0),!r||!r.access_token){console.error("No access token available");return}let e=await (0,N.ZS)(r.access_token);b(e)}catch(e){console.error("Error fetching dashboard data:",e),w.toast.error("Failed to load dashboard data")}finally{E(!1)}};fetchDashboardData()},[r]);let getActivityIcon=e=>{switch(e){case"user":return(0,l.jsx)(y.WY8,{className:"text-blue-500"});case"property":return(0,l.jsx)(y.m6D,{className:"text-primary-500"});case"request":return(0,l.jsx)(y.j4u,{className:"text-purple-500"});case"viewing":return(0,l.jsx)(y.vlc,{className:"text-green-500"});default:return(0,l.jsx)(y.H33,{className:"text-gray-500"})}},getAlertIcon=e=>{switch(e){case"warning":return(0,l.jsx)(y.bcx,{className:"text-amber-500"});case"error":return(0,l.jsx)(y.bcx,{className:"text-red-500"});case"info":return(0,l.jsx)(y.H33,{className:"text-blue-500"});case"success":return(0,l.jsx)(y._rq,{className:"text-green-500"});default:return(0,l.jsx)(y.H33,{className:"text-gray-500"})}};if(_)return(0,l.jsx)("div",{className:"flex justify-center items-center h-full",children:(0,l.jsxs)("div",{className:"animate-pulse flex flex-col items-center",children:[(0,l.jsx)("div",{className:"rounded-full bg-primary-100 h-12 w-12 flex items-center justify-center mb-3",children:(0,l.jsx)(y.CFv,{className:"h-6 w-6 text-primary-500"})}),(0,l.jsx)("p",{className:"text-primary-600",children:"Loading dashboard..."})]})});if(!n)return(0,l.jsx)("div",{className:"flex justify-center items-center h-full",children:(0,l.jsxs)("div",{className:"text-center",children:[(0,l.jsx)(y.bcx,{className:"h-12 w-12 text-red-500 mx-auto mb-3"}),(0,l.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Failed to Load Dashboard"}),(0,l.jsx)("p",{className:"text-gray-600 mb-4",children:"There was a problem fetching the dashboard data."}),(0,l.jsx)(f.Z,{variant:"primary",onClick:()=>window.location.reload(),children:"Try Again"})]})});let{stats:C,activities:k,alerts:T}=n;return(0,l.jsxs)("div",{className:"pb-12",children:[(0,l.jsxs)(g.E.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5},className:"mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("h1",{className:"text-heading-2",children:"Admin Dashboard"}),(0,l.jsxs)("p",{className:"text-subtitle mt-1",children:["Welcome back, ",(null==e?void 0:e.name)||"User","!"]})]}),(0,l.jsxs)("div",{className:"flex space-x-3",children:[(0,l.jsx)(f.Z,{variant:"outline",leftIcon:(0,l.jsx)(y.vWP,{}),size:"sm",children:"Notifications"}),(0,l.jsx)(f.Z,{variant:"gradient",leftIcon:(0,l.jsx)(y.OvN,{}),size:"sm",children:"New Property"})]})]}),(0,l.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",children:[(0,l.jsx)(g.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:.1},children:(0,l.jsxs)(h.Z,{className:"p-6 hover:shadow-md transition-shadow",children:[(0,l.jsxs)("div",{className:"flex justify-between items-start",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{className:"text-sm font-medium text-gray-600 mb-1",children:"Total Users"}),(0,l.jsx)("h3",{className:"text-2xl font-bold text-gray-900",children:C.totalUsers})]}),(0,l.jsx)("div",{className:"bg-blue-100 p-2 rounded-full",children:(0,l.jsx)(y.WY8,{className:"h-6 w-6 text-blue-600"})})]}),(0,l.jsxs)("div",{className:"mt-3 flex items-center",children:[(0,l.jsxs)("span",{className:"text-sm font-medium flex items-center ".concat(C.percentChangeUsers>=0?"text-green-600":"text-red-600"),children:[C.percentChangeUsers>=0?(0,l.jsx)(y.TKU,{className:"mr-1"}):(0,l.jsx)(y.Gx,{className:"mr-1"}),Math.abs(C.percentChangeUsers),"%"]}),(0,l.jsx)("span",{className:"ml-2 text-xs text-gray-500",children:"vs last month"})]})]})}),(0,l.jsx)(g.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:.2},children:(0,l.jsxs)(h.Z,{className:"p-6 hover:shadow-md transition-shadow",children:[(0,l.jsxs)("div",{className:"flex justify-between items-start",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{className:"text-sm font-medium text-gray-600 mb-1",children:"Total Properties"}),(0,l.jsx)("h3",{className:"text-2xl font-bold text-gray-900",children:C.totalProperties})]}),(0,l.jsx)("div",{className:"bg-primary-100 p-2 rounded-full",children:(0,l.jsx)(y.m6D,{className:"h-6 w-6 text-primary-600"})})]}),(0,l.jsxs)("div",{className:"mt-3 flex items-center",children:[(0,l.jsxs)("span",{className:"text-sm font-medium flex items-center ".concat(C.percentChangeProperties>=0?"text-green-600":"text-red-600"),children:[C.percentChangeProperties>=0?(0,l.jsx)(y.TKU,{className:"mr-1"}):(0,l.jsx)(y.Gx,{className:"mr-1"}),Math.abs(C.percentChangeProperties),"%"]}),(0,l.jsx)("span",{className:"ml-2 text-xs text-gray-500",children:"vs last month"})]})]})}),(0,l.jsx)(g.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:.3},children:(0,l.jsxs)(h.Z,{className:"p-6 hover:shadow-md transition-shadow",children:[(0,l.jsxs)("div",{className:"flex justify-between items-start",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{className:"text-sm font-medium text-gray-600 mb-1",children:"Active Requests"}),(0,l.jsx)("h3",{className:"text-2xl font-bold text-gray-900",children:C.activeRequests})]}),(0,l.jsx)("div",{className:"bg-purple-100 p-2 rounded-full",children:(0,l.jsx)(y.j4u,{className:"h-6 w-6 text-purple-600"})})]}),(0,l.jsxs)("div",{className:"mt-3 flex items-center",children:[(0,l.jsxs)("span",{className:"text-sm font-medium flex items-center ".concat(C.percentChangeRequests>=0?"text-green-600":"text-red-600"),children:[C.percentChangeRequests>=0?(0,l.jsx)(y.TKU,{className:"mr-1"}):(0,l.jsx)(y.Gx,{className:"mr-1"}),Math.abs(C.percentChangeRequests),"%"]}),(0,l.jsx)("span",{className:"ml-2 text-xs text-gray-500",children:"vs last month"})]})]})}),(0,l.jsx)(g.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:.4},children:(0,l.jsxs)(h.Z,{className:"p-6 hover:shadow-md transition-shadow",children:[(0,l.jsxs)("div",{className:"flex justify-between items-start",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{className:"text-sm font-medium text-gray-600 mb-1",children:"Total Revenue"}),(0,l.jsxs)("h3",{className:"text-2xl font-bold text-gray-900",children:["$",C.totalRevenue.toLocaleString()]})]}),(0,l.jsx)("div",{className:"bg-green-100 p-2 rounded-full",children:(0,l.jsx)(y.oQC,{className:"h-6 w-6 text-green-600"})})]}),(0,l.jsxs)("div",{className:"mt-3 flex items-center",children:[(0,l.jsxs)("span",{className:"text-sm font-medium flex items-center ".concat(C.percentChangeRevenue>=0?"text-green-600":"text-red-600"),children:[C.percentChangeRevenue>=0?(0,l.jsx)(y.TKU,{className:"mr-1"}):(0,l.jsx)(y.Gx,{className:"mr-1"}),Math.abs(C.percentChangeRevenue),"%"]}),(0,l.jsx)("span",{className:"ml-2 text-xs text-gray-500",children:"vs last month"})]})]})})]}),(0,l.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",children:[(0,l.jsx)(g.E.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.5},className:"lg:col-span-2",children:(0,l.jsxs)(h.Z,{className:"p-6 h-full",children:[(0,l.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,l.jsx)("h3",{className:"text-lg font-semibold text-gray-900",children:"Performance Overview"}),(0,l.jsxs)("select",{className:"border border-gray-200 rounded-md text-sm py-1 px-2",children:[(0,l.jsx)("option",{children:"Last 30 Days"}),(0,l.jsx)("option",{children:"Last Quarter"}),(0,l.jsx)("option",{children:"This Year"}),(0,l.jsx)("option",{children:"All Time"})]})]}),(0,l.jsx)("div",{className:"bg-gray-50 rounded-lg h-64 flex items-center justify-center",children:(0,l.jsxs)("div",{className:"text-center",children:[(0,l.jsx)(y.CFv,{className:"h-10 w-10 text-gray-400 mx-auto mb-2"}),(0,l.jsx)("p",{className:"text-gray-500",children:"Chart visualization would be here"}),(0,l.jsx)("p",{className:"text-xs text-gray-400 mt-1",children:"Shows revenue, properties, and user growth over time"})]})}),(0,l.jsxs)("div",{className:"flex justify-center space-x-8 mt-4",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"w-3 h-3 rounded-full bg-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-xs text-gray-600",children:"Properties"})]}),(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"w-3 h-3 rounded-full bg-blue-500 mr-2"}),(0,l.jsx)("span",{className:"text-xs text-gray-600",children:"Users"})]}),(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("div",{className:"w-3 h-3 rounded-full bg-green-500 mr-2"}),(0,l.jsx)("span",{className:"text-xs text-gray-600",children:"Revenue"})]})]})]})}),(0,l.jsx)(g.E.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.5,delay:.2},children:(0,l.jsxs)(h.Z,{className:"p-6 h-full",children:[(0,l.jsx)("h3",{className:"text-lg font-semibold text-gray-900 mb-6",children:"Quick Stats"}),(0,l.jsxs)("div",{className:"space-y-4",children:[(0,l.jsxs)("div",{className:"bg-gray-50 p-4 rounded-xl",children:[(0,l.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,l.jsx)("span",{className:"text-sm font-medium text-gray-600",children:"Top Locations"}),(0,l.jsx)(v(),{href:"/admin/analytics",className:"text-xs text-primary-600 hover:text-primary-800",children:"View All"})]}),(0,l.jsxs)("div",{className:"space-y-2",children:[(0,l.jsxs)("div",{className:"flex justify-between items-center",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)(y.i63,{className:"w-4 h-4 text-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-sm",children:"New Cairo"})]}),(0,l.jsx)("span",{className:"text-sm font-medium",children:"34%"})]}),(0,l.jsxs)("div",{className:"flex justify-between items-center",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)(y.i63,{className:"w-4 h-4 text-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-sm",children:"Sheikh Zayed"})]}),(0,l.jsx)("span",{className:"text-sm font-medium",children:"28%"})]}),(0,l.jsxs)("div",{className:"flex justify-between items-center",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)(y.i63,{className:"w-4 h-4 text-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-sm",children:"Maadi"})]}),(0,l.jsx)("span",{className:"text-sm font-medium",children:"16%"})]})]})]}),(0,l.jsxs)("div",{className:"bg-gray-50 p-4 rounded-xl",children:[(0,l.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,l.jsx)("span",{className:"text-sm font-medium text-gray-600",children:"Popular Property Types"}),(0,l.jsx)(v(),{href:"/admin/analytics",className:"text-xs text-primary-600 hover:text-primary-800",children:"Details"})]}),(0,l.jsxs)("div",{className:"space-y-2",children:[(0,l.jsxs)("div",{className:"flex justify-between items-center",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)(y.m6D,{className:"w-4 h-4 text-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-sm",children:"Apartments"})]}),(0,l.jsx)("span",{className:"text-sm font-medium",children:"45%"})]}),(0,l.jsxs)("div",{className:"flex justify-between items-center",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)(y.m6D,{className:"w-4 h-4 text-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-sm",children:"Villas"})]}),(0,l.jsx)("span",{className:"text-sm font-medium",children:"32%"})]}),(0,l.jsxs)("div",{className:"flex justify-between items-center",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)(y.m6D,{className:"w-4 h-4 text-primary-500 mr-2"}),(0,l.jsx)("span",{className:"text-sm",children:"Townhouses"})]}),(0,l.jsx)("span",{className:"text-sm font-medium",children:"18%"})]})]})]}),(0,l.jsxs)("div",{className:"p-4 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100",children:[(0,l.jsxs)("div",{className:"flex justify-between mb-3",children:[(0,l.jsx)("span",{className:"text-sm font-medium text-primary-900",children:"Conversion Rate"}),(0,l.jsx)("span",{className:"text-sm font-bold text-primary-700",children:"8.7%"})]}),(0,l.jsx)("div",{className:"w-full bg-white rounded-full h-2.5",children:(0,l.jsx)("div",{className:"bg-primary-500 h-2.5 rounded-full",style:{width:"8.7%"}})}),(0,l.jsx)("p",{className:"text-xs text-primary-700 mt-2",children:"Percentage of property requests that result in sales"})]})]})]})})]}),(0,l.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,l.jsx)(g.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:.1},children:(0,l.jsxs)(h.Z,{className:"p-6",children:[(0,l.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,l.jsx)("h3",{className:"text-lg font-semibold text-gray-900",children:"Recent Activity"}),(0,l.jsx)(v(),{href:"/admin/activities",className:"text-sm text-primary-600 hover:text-primary-800",children:"View All"})]}),(0,l.jsx)("div",{className:"space-y-4",children:k.map(e=>(0,l.jsxs)("div",{className:"flex items-start",children:[(0,l.jsx)("div",{className:"p-2 bg-gray-50 rounded-full mr-3",children:getActivityIcon(e.type)}),(0,l.jsxs)("div",{className:"flex-grow",children:[(0,l.jsxs)("div",{className:"flex justify-between",children:[(0,l.jsx)("p",{className:"text-sm font-medium text-gray-900",children:e.title}),(0,l.jsx)("span",{className:"text-xs text-gray-500",children:e.timestamp})]}),(0,l.jsxs)("p",{className:"text-xs text-gray-600",children:["by ",e.user]}),e.status&&(0,l.jsx)("div",{className:"mt-1",children:(0,l.jsx)("span",{className:"text-xs px-2 py-0.5 rounded-full ".concat("active"===e.status?"bg-green-100 text-green-800":"bg-amber-100 text-amber-800"),children:e.status})})]})]},e.id))}),(0,l.jsx)("div",{className:"mt-4 pt-4 border-t border-gray-100 text-center",children:(0,l.jsx)(f.Z,{variant:"light",size:"sm",className:"text-primary-600",children:"Load More"})})]})}),(0,l.jsx)(g.E.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:.2},children:(0,l.jsxs)(h.Z,{className:"p-6",children:[(0,l.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,l.jsx)("h3",{className:"text-lg font-semibold text-gray-900",children:"System Alerts"}),(0,l.jsx)(f.Z,{variant:"outline",size:"xs",leftIcon:(0,l.jsx)(y.vWP,{}),children:"Manage Alerts"})]}),(0,l.jsx)("div",{className:"space-y-4",children:T.map(e=>(0,l.jsx)("div",{className:"p-4 rounded-lg border ".concat("warning"===e.type?"bg-amber-50 border-amber-200":"error"===e.type?"bg-red-50 border-red-200":"info"===e.type?"bg-blue-50 border-blue-200":"bg-green-50 border-green-200"),children:(0,l.jsxs)("div",{className:"flex items-start",children:[(0,l.jsx)("div",{className:"mr-3 mt-0.5",children:getAlertIcon(e.type)}),(0,l.jsxs)("div",{className:"flex-grow",children:[(0,l.jsx)("p",{className:"text-sm font-medium ".concat("warning"===e.type?"text-amber-800":"error"===e.type?"text-red-800":"info"===e.type?"text-blue-800":"text-green-800"),children:e.message}),(0,l.jsx)("p",{className:"text-xs text-gray-500 mt-1",children:e.time})]})]})},e.id))}),(0,l.jsxs)("div",{className:"mt-6 grid grid-cols-2 gap-3",children:[(0,l.jsx)(f.Z,{variant:"light",className:"justify-center",leftIcon:(0,l.jsx)(y.WY8,{}),href:"/admin/users",children:"User Management"}),(0,l.jsx)(f.Z,{variant:"light",className:"justify-center",leftIcon:(0,l.jsx)(y.aCJ,{}),href:"/admin/properties",children:"Properties"}),(0,l.jsx)(f.Z,{variant:"light",className:"justify-center",leftIcon:(0,l.jsx)(y.nbt,{}),href:"/admin/settings",children:"Settings"}),(0,l.jsx)(f.Z,{variant:"light",className:"justify-center",leftIcon:(0,l.jsx)(y.CFv,{}),href:"/admin/analytics",children:"Analytics"})]})]})})]})]})}},4734:function(e,r,n){"use strict";n.d(r,{Z:function(){return Button}});var l=n(7437);n(2265);var c=n(1396),d=n.n(c);function LoadingSpinner(e){let{size:r="medium",color:n="primary",className:c=""}=e;return(0,l.jsx)("div",{className:"flex justify-center items-center ".concat(c),children:(0,l.jsx)("div",{className:"\n          rounded-full\n          animate-spin\n          ".concat({small:"h-4 w-4 border-2",medium:"h-8 w-8 border-2",large:"h-12 w-12 border-3"}[r],"\n          ").concat({primary:"border-primary-300 border-t-primary",white:"border-gray-200 border-t-white",gray:"border-gray-200 border-t-gray-600"}[n],"\n        ")})})}function Button(e){let{children:r,variant:n="primary",size:c="md",fullWidth:h=!1,href:f,loading:g=!1,outline:y=!1,rounded:b=!0,glass:v=!1,animation:N="none",className:w="",leftIcon:_,rightIcon:E,...C}=e,k=C.disabled?"opacity-60 cursor-not-allowed":"transform active:scale-[0.98] transition-transform",T="\n    inline-flex items-center justify-center\n    font-medium\n    transition-all duration-200\n    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500\n    ".concat({primary:y?"border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100":"bg-primary-600 hover:bg-primary-700 text-white shadow-sm",secondary:y?"border-2 border-gray-400 text-gray-700 hover:bg-gray-50 active:bg-gray-100":"bg-gray-600 hover:bg-gray-700 text-white shadow-sm",success:y?"border-2 border-green-500 text-green-600 hover:bg-green-50 active:bg-green-100":"bg-green-600 hover:bg-green-700 text-white shadow-sm",danger:y?"border-2 border-red-500 text-red-600 hover:bg-red-50 active:bg-red-100":"bg-red-600 hover:bg-red-700 text-white shadow-sm",warning:y?"border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100":"bg-amber-500 hover:bg-amber-600 text-white shadow-sm",info:y?"border-2 border-blue-400 text-blue-500 hover:bg-blue-50 active:bg-blue-100":"bg-blue-500 hover:bg-blue-600 text-white shadow-sm",light:y?"border-2 border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100":"bg-gray-100 hover:bg-gray-200 text-gray-800",dark:y?"border-2 border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-white":"bg-gray-800 hover:bg-gray-900 text-white shadow-sm",outline:"border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600 bg-white",gradient:"bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm"}[n],"\n    ").concat({xs:"text-xs px-2.5 py-1.5 gap-1",sm:"text-sm px-3 py-2 gap-1.5",md:"text-base px-4 py-2.5 gap-2",lg:"text-lg px-5 py-3 gap-2",xl:"text-xl px-6 py-3.5 gap-2.5"}[c],"\n    ").concat(h?"w-full":"","\n    ").concat(b?"rounded-full":"rounded-lg","\n    ").concat(v?"backdrop-blur-sm bg-opacity-80 shadow-sm":"","\n    ").concat({none:"",pulse:"animate-pulse",bounce:"animate-bounce"}[N],"\n    ").concat(k,"\n    ").concat(w,"\n  ");return f?(0,l.jsxs)(d(),{href:f,className:T,children:[_&&(0,l.jsx)("span",{className:"flex items-center",children:_}),r,E&&(0,l.jsx)("span",{className:"flex items-center",children:E})]}):(0,l.jsxs)("button",{className:T,disabled:g||C.disabled,...C,children:[g?(0,l.jsx)(LoadingSpinner,{size:"small",color:y?"primary":"white"}):_?(0,l.jsx)("span",{className:"flex items-center",children:_}):null,(0,l.jsx)("span",{children:r}),E&&!g&&(0,l.jsx)("span",{className:"flex items-center",children:E})]})}},2595:function(e,r,n){"use strict";n.d(r,{Z:function(){return Card}});var l=n(7437);function Card(e){let{children:r,className:n="",padding:c="small",shadow:d="small",rounded:h="medium",border:f=!1,hover:g=!1,clickable:y=!1}=e;return(0,l.jsx)("div",{className:"\n        bg-white\n        ".concat({none:"p-0",xs:"p-2",small:"p-3",medium:"p-4",large:"p-5"}[c],"\n        ").concat({none:"",small:"shadow-sm",medium:"shadow",large:"shadow-lg"}[d],"\n        ").concat({none:"rounded-none",small:"rounded-md",medium:"rounded-lg",large:"rounded-xl"}[h],"\n        ").concat(f?"border border-gray-100":"","\n        ").concat(g?"transition-all duration-200 hover:shadow-md hover:translate-y-[-1px]":"","\n        ").concat(y?"cursor-pointer active:scale-[0.99] active:shadow-inner transition-transform":"","\n        ").concat(n,"\n      "),children:r})}n(2265)},4033:function(e,r,n){e.exports=n(94)},5925:function(e,r,n){"use strict";let l,c;n.r(r),n.d(r,{CheckmarkIcon:function(){return H},ErrorIcon:function(){return z},LoaderIcon:function(){return L},ToastBar:function(){return es},ToastIcon:function(){return M},Toaster:function(){return Oe},default:function(){return er},resolveValue:function(){return dist_f},toast:function(){return dist_c},useToaster:function(){return O},useToasterStore:function(){return D}});var d=n(2265);let h={data:""},t=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||h,f=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,g=/\/\*[^]*?\*\/|  +/g,y=/\n+/g,o=(e,r)=>{let n="",l="",c="";for(let d in e){let h=e[d];"@"==d[0]?"i"==d[1]?n=d+" "+h+";":l+="f"==d[1]?o(h,d):d+"{"+o(h,"k"==d[1]?"":r)+"}":"object"==typeof h?l+=o(h,r?r.replace(/([^,])+/g,e=>d.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,r=>/&/.test(r)?r.replace(/&/g,e):e?e+" "+r:r)):d):null!=h&&(d=/^--/.test(d)?d:d.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=o.p?o.p(d,h):d+":"+h+";")}return n+(r&&c?r+"{"+c+"}":c)+l},b={},s=e=>{if("object"==typeof e){let r="";for(let n in e)r+=n+s(e[n]);return r}return e},i=(e,r,n,l,c)=>{var d;let h=s(e),v=b[h]||(b[h]=(e=>{let r=0,n=11;for(;r<e.length;)n=101*n+e.charCodeAt(r++)>>>0;return"go"+n})(h));if(!b[v]){let r=h!==e?e:(e=>{let r,n,l=[{}];for(;r=f.exec(e.replace(g,""));)r[4]?l.shift():r[3]?(n=r[3].replace(y," ").trim(),l.unshift(l[0][n]=l[0][n]||{})):l[0][r[1]]=r[2].replace(y," ").trim();return l[0]})(e);b[v]=o(c?{["@keyframes "+v]:r}:r,n?"":"."+v)}let N=n&&b.g?b.g:null;return n&&(b.g=b[v]),d=b[v],N?r.data=r.data.replace(N,d):-1===r.data.indexOf(d)&&(r.data=l?d+r.data:r.data+d),v},p=(e,r,n)=>e.reduce((e,l,c)=>{let d=r[c];if(d&&d.call){let e=d(n),r=e&&e.props&&e.props.className||/^go/.test(e)&&e;d=r?"."+r:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==d?"":d)},"");function u(e){let r=this||{},n=e.call?e(r.p):e;return i(n.unshift?n.raw?p(n,[].slice.call(arguments,1),r.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(r.p):n),{}):n,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let v,N,w,_=u.bind({k:1});function m(e,r,n,l){o.p=r,v=e,N=n,w=l}function j(e,r){let n=this||{};return function(){let l=arguments;function a(c,d){let h=Object.assign({},c),f=h.className||a.className;n.p=Object.assign({theme:N&&N()},h),n.o=/ *go\d+/.test(f),h.className=u.apply(n,l)+(f?" "+f:""),r&&(h.ref=d);let g=e;return e[0]&&(g=h.as||e,delete h.as),w&&g[0]&&w(h),v(g,h)}return r?r(a):a}}var W=e=>"function"==typeof e,dist_f=(e,r)=>W(e)?e(r):e,E=(l=0,()=>(++l).toString()),A=()=>{if(void 0===c&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");c=!e||e.matches}return c},U=(e,r)=>{switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===r.toast.id?{...e,...r.toast}:e)};case 2:let{toast:n}=r;return U(e,{type:e.toasts.find(e=>e.id===n.id)?1:0,toast:n});case 3:let{toastId:l}=r;return{...e,toasts:e.toasts.map(e=>e.id===l||void 0===l?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===r.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let c=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+c}))}}},C=[],k={toasts:[],pausedAt:void 0},dist_u=e=>{k=U(k,e),C.forEach(e=>{e(k)})},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={})=>{let[r,n]=(0,d.useState)(k),l=(0,d.useRef)(k);(0,d.useEffect)(()=>(l.current!==k&&n(k),C.push(n),()=>{let e=C.indexOf(n);e>-1&&C.splice(e,1)}),[]);let c=r.toasts.map(r=>{var n,l,c;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||(null==(n=e[r.type])?void 0:n.removeDelay)||(null==e?void 0:e.removeDelay),duration:r.duration||(null==(l=e[r.type])?void 0:l.duration)||(null==e?void 0:e.duration)||T[r.type],style:{...e.style,...null==(c=e[r.type])?void 0:c.style,...r.style}}});return{...r,toasts:c}},J=(e,r="blank",n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...n,id:(null==n?void 0:n.id)||E()}),x=e=>(r,n)=>{let l=J(r,e,n);return dist_u({type:2,toast:l}),l.id},dist_c=(e,r)=>x("blank")(e,r);dist_c.error=x("error"),dist_c.success=x("success"),dist_c.loading=x("loading"),dist_c.custom=x("custom"),dist_c.dismiss=e=>{dist_u({type:3,toastId:e})},dist_c.remove=e=>dist_u({type:4,toastId:e}),dist_c.promise=(e,r,n)=>{let l=dist_c.loading(r.loading,{...n,...null==n?void 0:n.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let c=r.success?dist_f(r.success,e):void 0;return c?dist_c.success(c,{id:l,...n,...null==n?void 0:n.success}):dist_c.dismiss(l),e}).catch(e=>{let c=r.error?dist_f(r.error,e):void 0;c?dist_c.error(c,{id:l,...n,...null==n?void 0:n.error}):dist_c.dismiss(l)}),e};var K=(e,r)=>{dist_u({type:1,toast:{id:e,height:r}})},X=()=>{dist_u({type:5,time:Date.now()})},I=new Map,P=1e3,ee=(e,r=P)=>{if(I.has(e))return;let n=setTimeout(()=>{I.delete(e),dist_u({type:4,toastId:e})},r);I.set(e,n)},O=e=>{let{toasts:r,pausedAt:n}=D(e);(0,d.useEffect)(()=>{if(n)return;let e=Date.now(),l=r.map(r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(n<0){r.visible&&dist_c.dismiss(r.id);return}return setTimeout(()=>dist_c.dismiss(r.id),n)});return()=>{l.forEach(e=>e&&clearTimeout(e))}},[r,n]);let l=(0,d.useCallback)(()=>{n&&dist_u({type:6,time:Date.now()})},[n]),c=(0,d.useCallback)((e,n)=>{let{reverseOrder:l=!1,gutter:c=8,defaultPosition:d}=n||{},h=r.filter(r=>(r.position||d)===(e.position||d)&&r.height),f=h.findIndex(r=>r.id===e.id),g=h.filter((e,r)=>r<f&&e.visible).length;return h.filter(e=>e.visible).slice(...l?[g+1]:[0,g]).reduce((e,r)=>e+(r.height||0)+c,0)},[r]);return(0,d.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)ee(e.id,e.removeDelay);else{let r=I.get(e.id);r&&(clearTimeout(r),I.delete(e.id))}})},[r]),{toasts:r,handlers:{updateHeight:K,startPause:X,endPause:l,calculateOffset:c}}},Z=_`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,$=_`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,S=_`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,z=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${S} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,R=_`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,L=j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${R} 1s linear infinite;
`,F=_`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,q=_`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,H=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${q} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Y=j("div")`
  position: absolute;
`,B=j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,G=_`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${G} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,M=({toast:e})=>{let{icon:r,type:n,iconTheme:l}=e;return void 0!==r?"string"==typeof r?d.createElement(V,null,r):r:"blank"===n?null:d.createElement(B,null,d.createElement(L,{...l}),"loading"!==n&&d.createElement(Y,null,"error"===n?d.createElement(z,{...l}):d.createElement(H,{...l})))},ye=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ge=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,Q=j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,et=j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ae=(e,r)=>{let n=e.includes("top")?1:-1,[l,c]=A()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ye(n),ge(n)];return{animation:r?`${_(l)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${_(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},es=d.memo(({toast:e,position:r,style:n,children:l})=>{let c=e.height?Ae(e.position||r||"top-center",e.visible):{opacity:0},h=d.createElement(M,{toast:e}),f=d.createElement(et,{...e.ariaProps},dist_f(e.message,e));return d.createElement(Q,{className:e.className,style:{...c,...n,...e.style}},"function"==typeof l?l({icon:h,message:f}):d.createElement(d.Fragment,null,h,f))});m(d.createElement);var ve=({id:e,className:r,style:n,onHeightUpdate:l,children:c})=>{let h=d.useCallback(r=>{if(r){let i=()=>{l(e,r.getBoundingClientRect().height)};i(),new MutationObserver(i).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,l]);return d.createElement("div",{ref:h,className:r,style:n},c)},Ee=(e,r)=>{let n=e.includes("top"),l=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...l}},ea=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Oe=({reverseOrder:e,position:r="top-center",toastOptions:n,gutter:l,children:c,containerStyle:h,containerClassName:f})=>{let{toasts:g,handlers:y}=O(n);return d.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...h},className:f,onMouseEnter:y.startPause,onMouseLeave:y.endPause},g.map(n=>{let h=n.position||r,f=Ee(h,y.calculateOffset(n,{reverseOrder:e,gutter:l,defaultPosition:r}));return d.createElement(ve,{id:n.id,key:n.id,onHeightUpdate:y.updateHeight,className:n.visible?ea:"",style:f},"custom"===n.type?dist_f(n.message,n):c?c(n):d.createElement(es,{toast:n,position:h}))}))},er=dist_c}},function(e){e.O(0,[2438,8920,8611,9480,2971,2472,1744],function(){return e(e.s=1636)}),_N_E=e.O()}]);