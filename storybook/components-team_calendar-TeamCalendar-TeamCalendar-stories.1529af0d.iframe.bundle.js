"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[7465],{"./src/components/team_calendar/TeamCalendar/TeamCalendar.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>TeamCalendar_stories});var react=__webpack_require__("./node_modules/react/index.js"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),Button=__webpack_require__("./src/components/common/Button/Button.tsx"),DateCell=__webpack_require__("./src/components/common/DateCell/DateCell.tsx"),ScheduleModal=__webpack_require__("./src/components/team_calendar/ScheduleModal/ScheduleModal.tsx"),ScheduleBar=__webpack_require__("./src/components/team_calendar/ScheduleBar/ScheduleBar.tsx"),ScheduleAddModal=__webpack_require__("./src/components/team_calendar/ScheduleAddModal/ScheduleAddModal.tsx"),ScheduleEditModal=__webpack_require__("./src/components/team_calendar/ScheduleEditModal/ScheduleEditModal.tsx"),ScheduleMoreCell=__webpack_require__("./src/components/team_calendar/ScheduleMoreCell/ScheduleMoreCell.tsx"),DailyScheduleModal=__webpack_require__("./src/components/team_calendar/DailyScheduleModal/DailyScheduleModal.tsx"),ICalendarModal=__webpack_require__("./src/components/team_calendar/ICalendarModal/ICalendarModal.tsx"),useCalendar=__webpack_require__("./src/hooks/useCalendar.ts"),useModal=__webpack_require__("./src/hooks/useModal.ts");var useQuery=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useQuery.mjs"),schedule=__webpack_require__("./src/apis/schedule.ts");var useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts");var QueryClientProvider=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs");const usePrefetchSchedules=async(teamPlaceId,year,month)=>{const queryClient=(0,QueryClientProvider.NL)();teamPlaceId>0&&await queryClient.prefetchQuery(["schedules",teamPlaceId,year,month],(()=>(0,schedule.Rd)(teamPlaceId,year,month+1)))};var constants_calendar=__webpack_require__("./src/constants/calendar.ts"),parseDate=__webpack_require__("./src/utils/parseDate.ts"),generateUuid=__webpack_require__("./src/utils/generateUuid.ts");const getFirstLastDateOfCalendar=(year,month)=>{const firstDateOfMonth=new Date(year,month),firstDateOfCalendar=new Date(firstDateOfMonth.getTime()-constants_calendar.s2*firstDateOfMonth.getDay()),lastDateOfCalendar=new Date(firstDateOfCalendar.getTime()+constants_calendar.XN.ROW_SIZE*constants_calendar.XN.COLUMN_SIZE*constants_calendar.s2-1);return{firstDateOfCalendar,lastDateOfCalendar}},generateCalendarObject=(year,month)=>{const{firstDateOfCalendar}=getFirstLastDateOfCalendar(year,month),calendarObject={};return Array.from({length:constants_calendar.XN.ROW_SIZE*constants_calendar.XN.COLUMN_SIZE},((_,index)=>{const currentDate=new Date(firstDateOfCalendar.getTime()+index*constants_calendar.s2),formattedDate=formatDate(currentDate),position={row:Math.floor(index/constants_calendar.XN.COLUMN_SIZE),column:index%constants_calendar.XN.COLUMN_SIZE};calendarObject[formattedDate]=position})),calendarObject},formatDate=rawDate=>{const{year,month,date}=(0,parseDate.s)(rawDate);return`${year}/${month+1}/${date}`},generateRawScheduleBars=(year,month,schedules,calendarObject)=>{const rawScheduleBars=[];return schedules.forEach((schedule=>{const{startDateTime,endDateTime,id:scheduleId,title}=schedule,{firstDateOfCalendar,lastDateOfCalendar}=getFirstLastDateOfCalendar(year,month),startDate=new Date(Math.max(new Date(startDateTime).getTime(),firstDateOfCalendar.getTime())),endDate=new Date(Math.min(new Date(endDateTime).getTime(),lastDateOfCalendar.getTime()));if(startDate<=endDate){const duration=calcDuration(startDate,endDate),id=(0,generateUuid.R)(),{row,column}=calendarObject[formatDate(startDate)];rawScheduleBars.push({id,scheduleId,schedule,title,row,column,duration,level:0,roundedStart:!1,roundedEnd:!1})}})),rawScheduleBars},calcDuration=(start,end)=>{const startDate=new Date(start.getFullYear(),start.getMonth(),start.getDate()),endDate=new Date(end.getFullYear(),end.getMonth(),end.getDate()),diff=new Date(startDate).getTime()-new Date(endDate).getTime();return Math.abs(diff/constants_calendar.s2)+1},sliceScheduleBars=(year,month,rawScheduleBars)=>{const slicedScheduleBars=[],{firstDateOfCalendar,lastDateOfCalendar}=getFirstLastDateOfCalendar(year,month);return rawScheduleBars.forEach((scheduleBar=>{const{row,column,duration,schedule}=scheduleBar;let remainingDuration=duration,currentRow=row,currentColumn=column,isFirstSlice=!0;for(;remainingDuration>0&&currentRow<constants_calendar.XN.ROW_SIZE;){const currentDuration=Math.min(remainingDuration,constants_calendar.XN.COLUMN_SIZE-currentColumn);remainingDuration-=currentDuration;const isRoundedStart=isFirstSlice&&new Date(schedule.startDateTime)>=firstDateOfCalendar,isRoundedEnd=0===remainingDuration&&new Date(schedule.endDateTime)<=lastDateOfCalendar;slicedScheduleBars.push({...scheduleBar,row:currentRow,column:currentColumn,duration:currentDuration,roundedStart:isRoundedStart,roundedEnd:isRoundedEnd}),currentRow+=1,currentColumn=0,isFirstSlice=!1}})),slicedScheduleBars},giveLevelToScheduleBars=scheduleBars=>{const leveledScheduleBars=[],lastIndexes=[],sortedScheduleBars=(scheduleBars=>[...scheduleBars].sort(((a,b)=>a.row!==b.row?a.row-b.row:a.column!==b.column?a.column-b.column:b.duration-a.duration)))(scheduleBars);return sortedScheduleBars.forEach((scheduleBar=>{const{row,column,duration}=scheduleBar,level=lastIndexes.findIndex((lastIndex=>lastIndex<row*constants_calendar.XN.COLUMN_SIZE+column));-1===level?(lastIndexes.push(row*constants_calendar.XN.COLUMN_SIZE+column+duration-1),leveledScheduleBars.push({...scheduleBar,level:lastIndexes.length-1})):(lastIndexes[level]=row*constants_calendar.XN.COLUMN_SIZE+column+duration-1,leveledScheduleBars.push({...scheduleBar,level}))})),leveledScheduleBars};var arrayOf=__webpack_require__("./src/utils/arrayOf.ts"),getDateByPosition=__webpack_require__("./src/utils/getDateByPosition.ts"),svg=__webpack_require__("./src/assets/svg/index.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Container=styled_components_browser_esm.zo.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  padding: 0 ${({calendarSize})=>"md"===calendarSize?10:0}px;
`,CalendarHeader=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`,ButtonContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
`,FeatureButtonContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  column-gap: 8px;
`,DaysOfWeek=styled_components_browser_esm.zo.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  height: ${({calendarSize})=>"md"===calendarSize?24:20}px;

  border-bottom: 2px solid ${({theme})=>theme.color.GRAY200};
`,DayOfWeek=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 16px;

  &:nth-child(1) {
    color: ${({theme})=>theme.color.RED};
  }

  &:nth-child(7) {
    color: ${({theme})=>theme.color.PURPLE};
  }
`,DateView=styled_components_browser_esm.zo.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: ${({calendarSize})=>"md"===calendarSize?110:80}px;

  background-color: ${({theme})=>theme.color.WHITE};

  border-left: 2px solid ${({theme})=>theme.color.GRAY200};

  & > div {
    border-right: 2px solid ${({theme})=>theme.color.GRAY200};
    border-bottom: 2px solid ${({theme})=>theme.color.GRAY200};
  }
`,ScheduleBarContainer=styled_components_browser_esm.zo.div`
  position: relative;
`,scheduleAddButton=calendarSize=>styled_components_browser_esm.iv`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${"md"===calendarSize?30:24}px;
  height: ${"md"===calendarSize?30:24}px;
  padding: 4px;

  font-size: 24px;
`,arrowButton=calendarSize=>styled_components_browser_esm.iv`
  ${"sm"===calendarSize&&"padding: 4px 8px"}
`,exportButton=calendarSize=>styled_components_browser_esm.iv`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${"md"===calendarSize?30:24}px;
  height: ${"md"===calendarSize?30:24}px;
  padding: 4px;

  background-color: ${({theme})=>theme.color.GRAY500};
`;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const TeamCalendar=props=>{const{calendarSize="md"}=props,{teamPlaceId}=(0,useTeamPlace.l)(),{year,month,calendar,currentDate,today,handlers:{handlePrevButtonClick,handleNextButtonClick}}=(0,useCalendar.Z)(),{isModalOpen,openModal}=(0,useModal.d)(),{modalScheduleId,modalPosition,handlers:{handleScheduleModalOpen}}=(()=>{const[modalScheduleId,setModalScheduleId]=(0,react.useState)(0),[modalPosition,setModalPosition]=(0,react.useState)({row:0,column:0,level:0}),{openModal}=(0,useModal.d)();return{modalPosition,modalScheduleId,handlers:{handleScheduleModalOpen:({scheduleId,row,column,level})=>{setModalScheduleId((()=>scheduleId)),setModalPosition((()=>({row,column,level}))),openModal()}}}})(),schedules=((teamPlaceId,year,month)=>{const{data}=(0,useQuery.a)(["schedules",teamPlaceId,year,month],(()=>(0,schedule.Rd)(teamPlaceId,year,month+1)),{enabled:teamPlaceId>0});if(void 0===data)return[];const{schedules}=data;return schedules})(teamPlaceId,year,month);usePrefetchSchedules(teamPlaceId,11===month?year+1:year,11===month?0:month+1),usePrefetchSchedules(teamPlaceId,0===month?year-1:year,0===month?11:month-1);const[clickedDate,setClickedDate]=(0,react.useState)(currentDate),[modalType,setModalType]=(0,react.useState)(constants_calendar.sZ.ADD),[dailyModalDate,setDailyModalDate]=(0,react.useState)(new Date),[dailyModalPosition,setDailyModalPosition]=(0,react.useState)({row:0,column:0}),calendarRef=(0,react.useRef)(null),{width,left}=(targetRef=>{const[width,setWidth]=(0,react.useState)(0),[left,setLeft]=(0,react.useState)(0),updateWidthLeft=(0,react.useCallback)((()=>{const targetElement=targetRef.current;if(targetElement){const{width,left}=targetElement.getBoundingClientRect();setWidth((()=>width)),setLeft((()=>left))}}),[targetRef]);return(0,react.useEffect)((()=>(window.addEventListener("resize",updateWidthLeft),updateWidthLeft(),()=>{window.removeEventListener("resize",updateWidthLeft)})),[targetRef,updateWidthLeft]),{width,left}})(calendarRef),scheduleBars=((year,month,schedules)=>{const calendarObject=generateCalendarObject(year,month),rawScheduleBars=generateRawScheduleBars(year,month,schedules,calendarObject),leveledScheduleBars=giveLevelToScheduleBars(rawScheduleBars);return sliceScheduleBars(year,month,leveledScheduleBars)})(year,month,schedules),handleModalOpen=modalOpenType=>{setModalType((()=>modalOpenType)),openModal()},handleDailyScheduleModalOpen=(day,row,col)=>{setModalType((()=>constants_calendar.sZ.DAILY)),setDailyModalDate((()=>day)),setDailyModalPosition({row,column:col}),openModal()},modal=isModalOpen?(modalOpenType=modalType)===constants_calendar.sZ.ADD?(0,jsx_runtime.jsx)(ScheduleAddModal.Z,{calendarSize,clickedDate}):modalOpenType===constants_calendar.sZ.VIEW?(0,jsx_runtime.jsx)(ScheduleModal.Z,{calendarWidth:width,calendarLeft:left,calendarSize,scheduleId:modalScheduleId,position:modalPosition,onOpenScheduleEditModal:()=>handleModalOpen(constants_calendar.sZ.EDIT)}):modalOpenType===constants_calendar.sZ.EDIT?(0,jsx_runtime.jsx)(ScheduleEditModal.Z,{calendarSize,scheduleId:modalScheduleId,initialSchedule:schedules.find((schedule=>schedule.id===modalScheduleId))}):modalOpenType===constants_calendar.sZ.DAILY?(0,jsx_runtime.jsx)(DailyScheduleModal.Z,{calendarWidth:width,calendarLeft:left,calendarSize,rawDate:dailyModalDate,position:dailyModalPosition,onScheduleModalOpen:handleScheduleModalOpen,onSetModalType:()=>setModalType((()=>constants_calendar.sZ.VIEW))}):modalOpenType===constants_calendar.sZ.EXPORT?(0,jsx_runtime.jsx)(ICalendarModal.Z,{calendarSize}):null:null;var modalOpenType,size;return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsxs)(Container,{calendarSize,children:[(0,jsx_runtime.jsxs)(CalendarHeader,{children:[(0,jsx_runtime.jsx)("div",{}),(0,jsx_runtime.jsxs)(ButtonContainer,{children:[(0,jsx_runtime.jsx)(Button.Z,{variant:"plain",onClick:handlePrevButtonClick,"aria-label":"이전 달로 이동하기",css:arrowButton(calendarSize),children:(0,jsx_runtime.jsx)(svg.Y4,{})}),(0,jsx_runtime.jsx)("time",{children:(0,jsx_runtime.jsxs)(Text.Z,{weight:"semiBold",css:(size=calendarSize,styled_components_browser_esm.iv`
  font-size: ${"md"===size?24:18}px;
`),children:[year,"년 ",month+1,"월"]})}),(0,jsx_runtime.jsx)(Button.Z,{variant:"plain",onClick:handleNextButtonClick,css:arrowButton(calendarSize),"aria-label":"다음 달로 이동하기",children:(0,jsx_runtime.jsx)(svg.LZ,{})})]}),(0,jsx_runtime.jsxs)(FeatureButtonContainer,{children:[(0,jsx_runtime.jsx)(Button.Z,{css:exportButton(calendarSize),onClick:()=>{handleModalOpen(constants_calendar.sZ.EXPORT)},"aria-label":"일정 내보내기",children:(0,jsx_runtime.jsx)(svg.Hy,{})}),(0,jsx_runtime.jsx)(Button.Z,{css:scheduleAddButton(calendarSize),onClick:()=>{setClickedDate((()=>currentDate)),handleModalOpen(constants_calendar.sZ.ADD)},"aria-label":"새로운 일정 등록하기",children:(0,jsx_runtime.jsx)(svg.pO,{})})]})]}),(0,jsx_runtime.jsxs)("div",{ref:calendarRef,children:[(0,jsx_runtime.jsx)(DaysOfWeek,{calendarSize,children:constants_calendar.sb.map((day=>(0,jsx_runtime.jsx)(DayOfWeek,{children:day},day)))}),(0,jsx_runtime.jsx)("div",{children:calendar.map(((week,rowIndex)=>(0,jsx_runtime.jsxs)(react.Fragment,{children:[(0,jsx_runtime.jsx)(ScheduleBarContainer,{children:scheduleBars.map((scheduleBar=>{const{id,scheduleId,row,column,level,duration}=scheduleBar;return row===rowIndex&&level>2?(0,arrayOf.C)(duration).map(((_,index)=>{const date=(0,getDateByPosition.S)(year,month,row,column+index);return(0,jsx_runtime.jsx)(ScheduleMoreCell.Z,{calendarSize,column:column+index,onClick:()=>handleDailyScheduleModalOpen(date,row,column+index)},id+index)})):row===rowIndex?(0,jsx_runtime.jsx)(ScheduleBar.Z,{calendarSize,onClick:()=>{setModalType((()=>constants_calendar.sZ.VIEW)),handleScheduleModalOpen({scheduleId,row,column,level})},...scheduleBar},id):null}))}),(0,jsx_runtime.jsx)(DateView,{calendarSize,children:week.map(((day,colIndex)=>{const{year:renderYear,month:renderMonth,date:renderDate}=(0,parseDate.s)(day),isToday=today.year===renderYear&&today.month===renderMonth&&today.date===renderDate;return(0,jsx_runtime.jsx)(DateCell.Z,{rawDate:day,currentMonth:month,isToday,onClick:()=>{(clickedDate=>{setClickedDate((()=>clickedDate)),handleModalOpen(constants_calendar.sZ.ADD)})(day)},onDayClick:e=>{e.stopPropagation(),handleDailyScheduleModalOpen(day,rowIndex,colIndex)}},day.toISOString())}))})]},rowIndex)))})]})]}),modal]})},TeamCalendar_TeamCalendar=TeamCalendar;try{TeamCalendar.displayName="TeamCalendar",TeamCalendar.__docgenInfo={description:"",displayName:"TeamCalendar",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/TeamCalendar/TeamCalendar.tsx#TeamCalendar"]={docgenInfo:TeamCalendar.__docgenInfo,name:"TeamCalendar",path:"src/components/team_calendar/TeamCalendar/TeamCalendar.tsx#TeamCalendar"})}catch(__react_docgen_typescript_loader_error){}const TeamCalendar_stories={title:"Calendar/TeamCalendar",component:TeamCalendar_TeamCalendar,tags:["autodocs"]},Default={args:{}};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {}\n}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=["Default"]},"./src/components/common/DateCell/DateCell.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>DateCell_DateCell});var parseDate=__webpack_require__("./src/utils/parseDate.ts"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Wrapper=styled_components_browser_esm.zo.div`
  display: flex;
  flex-direction: column;

  ${({size})=>"sm"===size?styled_components_browser_esm.iv`
        align-items: center;
        padding-top: 4px;
      `:"md"===size||"lg"===size?styled_components_browser_esm.iv`
        align-items: flex-end;
        padding: 2px 2px 0 0;

        text-align: right;
      `:void 0};

  color: ${({isSaturday,isSunday,theme})=>isSunday?theme.color.RED:isSaturday?theme.color.PURPLE:theme.color.BLACK};

  cursor: pointer;
`,DateBadge=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 24px;
  height: 24px;

  border-radius: 50%;

  &:hover {
    background-color: ${({theme})=>theme.color.GRAY300};
  }
  background-color: ${({isToday,theme,isCurrentMonth})=>isToday&&isCurrentMonth?theme.color.BLACK:isToday?theme.color.GRAY400:void 0};
`,dateText=(isCurrentMonth,isToday,isSaturday,isSunday,size)=>styled_components_browser_esm.iv`
  color: ${({theme})=>isToday?theme.color.WHITE:isSunday?theme.color.RED:isSaturday?theme.color.PURPLE:theme.color.BLACK};
  font-size: ${"sm"===size?14:12}px;

  opacity: ${isCurrentMonth?1:.3};
`;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const DateCell=props=>{const{rawDate,currentMonth,size="lg",isToday=!1,onClick,onDayClick}=props,{date,day}=(0,parseDate.s)(rawDate),isSunday=0===day,isSaturday=6===day,isCurrentMonth=rawDate.getMonth()===currentMonth;return(0,jsx_runtime.jsx)(Wrapper,{isSunday,isSaturday,size,onClick,children:(0,jsx_runtime.jsx)(DateBadge,{isCurrentMonth,onClick:onDayClick,isToday,children:(0,jsx_runtime.jsx)(Text.Z,{css:dateText(isCurrentMonth,isToday,isSaturday,isSunday,size),children:date})})})};DateCell.displayName="DateCell";const DateCell_DateCell=DateCell;try{DateCell.displayName="DateCell",DateCell.__docgenInfo={description:"",displayName:"DateCell",props:{rawDate:{defaultValue:null,description:"",name:"rawDate",required:!0,type:{name:"Date"}},currentMonth:{defaultValue:null,description:"",name:"currentMonth",required:!0,type:{name:"number"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},isToday:{defaultValue:null,description:"",name:"isToday",required:!1,type:{name:"boolean"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},onDayClick:{defaultValue:null,description:"",name:"onDayClick",required:!1,type:{name:"MouseEventHandler<HTMLDivElement>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/common/DateCell/DateCell.tsx#DateCell"]={docgenInfo:DateCell.__docgenInfo,name:"DateCell",path:"src/components/common/DateCell/DateCell.tsx#DateCell"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/DailyScheduleModal/DailyScheduleModal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>DailyScheduleModal_DailyScheduleModal});var useModal=__webpack_require__("./src/hooks/useModal.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Backdrop=styled_components_browser_esm.zo.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`,Container=styled_components_browser_esm.zo.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  z-index: ${({theme})=>theme.zIndex.MODAL};

  width: 300px;
  height: 338px;
  padding: 10px 20px 20px 20px;

  border-radius: 10px;
  background-color: ${({theme})=>theme.color.WHITE};

  box-shadow:
    0 0 1px #1b1d1f33,
    0 15px 25px #1b1d1f33,
    0 5px 10px #1b1d1f1f;

  ${({css})=>css};
`,Header=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 38px;
  padding-bottom: 4px;
  margin-bottom: 12px;

  border-bottom: ${({theme})=>`1px solid ${theme.color.GRAY300}`};
`,ScheduleWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  position: relative;
  flex-wrap: wrap;
  overflow: auto;

  width: 100%;
  max-height: 80%;
  height: auto;

  gap: 10px;
`,ScheduleBox=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 40px;
  column-gap: 10px;

  background-color: ${({theme,teamPlaceColor})=>theme.teamColor[teamPlaceColor]};
  border-radius: 4px;

  color: ${({theme})=>theme.color.WHITE};

  cursor: pointer;

  &:hover {
    opacity: 0.8;
    transition: 0.2s;
  }
`,closeButton=styled_components_browser_esm.iv`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 22px;
  height: 38px;
  padding: 8px 0;
`,teamName=styled_components_browser_esm.iv`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 200px;
`,modalLocation=(row,column,calendarWidth,calendarLeft,calendarSize)=>"md"===calendarSize?styled_components_browser_esm.iv`
      position: absolute;
      top: ${148+(row>3?-228:0)+110*row}px;
      left: ${(column>3?-300:calendarWidth/7)+calendarLeft+calendarWidth*column/7}px;
    `:"sm"==calendarSize?styled_components_browser_esm.iv`
      position: fixed;
      top: 23%;
      left: 19%;
    `:void 0;var Modal=__webpack_require__("./src/components/common/Modal/Modal.tsx"),svg=__webpack_require__("./src/assets/svg/index.ts"),Button=__webpack_require__("./src/components/common/Button/Button.tsx"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),parseDate=__webpack_require__("./src/utils/parseDate.ts"),useQuery=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useQuery.mjs"),schedule=__webpack_require__("./src/apis/schedule.ts");var useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const DailyScheduleModal=props=>{const{rawDate,calendarSize="md",calendarWidth,calendarLeft,position,onScheduleModalOpen,onSetModalType}=props,{row,column}=position,{closeModal}=(0,useModal.d)(),{teamPlaceColor,teamPlaceId}=(0,useTeamPlace.l)(),{year,month,date}=(0,parseDate.s)(rawDate),schedules=((teamPlaceId,year,month,day)=>{const{data}=(0,useQuery.a)(["dailySchedules",year,month,day],(()=>(0,schedule.Rd)(teamPlaceId,year,month+1,day)),{enabled:teamPlaceId>0});if(void 0===data)return[];const{schedules}=data;return schedules})(teamPlaceId,year,month,date);return(0,jsx_runtime.jsxs)(Modal.Z,{children:[(0,jsx_runtime.jsx)(Backdrop,{onClick:closeModal}),(0,jsx_runtime.jsxs)(Container,{css:modalLocation(row,column,calendarWidth,calendarLeft,calendarSize),children:[(0,jsx_runtime.jsxs)(Header,{children:[(0,jsx_runtime.jsxs)(Text.Z,{children:[month+1,"월 ",date,"일"]}),(0,jsx_runtime.jsx)(Button.Z,{variant:"plain",type:"button",onClick:closeModal,css:closeButton,"aria-label":"닫기",children:(0,jsx_runtime.jsx)(svg.Tw,{})})]}),(0,jsx_runtime.jsx)(ScheduleWrapper,{children:0!==schedules.length?schedules.map(((schedule,index)=>{const{id,title}=schedule;return(0,jsx_runtime.jsx)(ScheduleBox,{teamPlaceColor,title,onClick:()=>{onScheduleModalOpen({scheduleId:id,row,column,level:4}),onSetModalType()},children:(0,jsx_runtime.jsx)(Text.Z,{size:"lg",css:teamName,children:title})},index)})):(0,jsx_runtime.jsx)(Text.Z,{size:"lg",css:teamName,children:"등록된 일정이 없습니다."})})]})]})};DailyScheduleModal.displayName="DailyScheduleModal";const DailyScheduleModal_DailyScheduleModal=DailyScheduleModal;try{DailyScheduleModal.displayName="DailyScheduleModal",DailyScheduleModal.__docgenInfo={description:"",displayName:"DailyScheduleModal",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}},position:{defaultValue:null,description:"",name:"position",required:!0,type:{name:"Position"}},rawDate:{defaultValue:null,description:"",name:"rawDate",required:!0,type:{name:"Date"}},calendarWidth:{defaultValue:null,description:"",name:"calendarWidth",required:!0,type:{name:"number"}},calendarLeft:{defaultValue:null,description:"",name:"calendarLeft",required:!0,type:{name:"number"}},onScheduleModalOpen:{defaultValue:null,description:"",name:"onScheduleModalOpen",required:!0,type:{name:"({ scheduleId, row, column, level, }: SchedulePosition & { scheduleId: number; }) => void"}},onSetModalType:{defaultValue:null,description:"",name:"onSetModalType",required:!0,type:{name:"() => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/DailyScheduleModal/DailyScheduleModal.tsx#DailyScheduleModal"]={docgenInfo:DailyScheduleModal.__docgenInfo,name:"DailyScheduleModal",path:"src/components/team_calendar/DailyScheduleModal/DailyScheduleModal.tsx#DailyScheduleModal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/ICalendarModal/ICalendarModal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ICalendarModal_ICalendarModal});var react=__webpack_require__("./node_modules/react/index.js"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),Button=__webpack_require__("./src/components/common/Button/Button.tsx"),Modal=__webpack_require__("./src/components/common/Modal/Modal.tsx"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const SpacingRoot=styled_components_browser_esm.ZP.div`
  ${({direction,size})=>"vertical"===direction?styled_components_browser_esm.iv`
        width: 1px;
        height: ${size}px;
      `:"horizontal"===direction?styled_components_browser_esm.iv`
        width: ${size}px;
        height: 1px;
      `:void 0}
`;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Spacing=props=>{const{size=1,direction="vertical"}=props;return(0,jsx_runtime.jsx)(SpacingRoot,{size,direction})};Spacing.displayName="Spacing";const Spacing_Spacing=Spacing;try{Spacing.displayName="Spacing",Spacing.__docgenInfo={description:"",displayName:"Spacing",props:{size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"number"}},direction:{defaultValue:null,description:"",name:"direction",required:!1,type:{name:"enum",value:[{value:'"horizontal"'},{value:'"vertical"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/common/Spacing/Spacing.tsx#Spacing"]={docgenInfo:Spacing.__docgenInfo,name:"Spacing",path:"src/components/common/Spacing/Spacing.tsx#Spacing"})}catch(__react_docgen_typescript_loader_error){}var useModal=__webpack_require__("./src/hooks/useModal.ts"),useQuery=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useQuery.mjs"),schedule=__webpack_require__("./src/apis/schedule.ts");var useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts"),useToast=__webpack_require__("./src/hooks/useToast.ts"),svg=__webpack_require__("./src/assets/svg/index.ts");const Backdrop=styled_components_browser_esm.ZP.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
`,Container=styled_components_browser_esm.ZP.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  ${({calendarSize})=>"md"===calendarSize?styled_components_browser_esm.iv`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `:"sm"===calendarSize?styled_components_browser_esm.iv`
        top: 25%;
        left: 14.4%;
      `:void 0}

  width: 400px;
  min-height: 200px;
  padding: 20px;

  border-radius: 8px;
  box-shadow:
    0 0 1px #1b1d1f33,
    0 15px 25px #1b1d1f33,
    0 5px 10px #1b1d1f1f;
  background-color: ${({theme})=>theme.color.WHITE};
`,Header=styled_components_browser_esm.ZP.div`
  position: relative;
  display: flex;
  align-items: center;

  & > button {
    margin-left: auto;
  }
`,TooltipWrapper=styled_components_browser_esm.ZP.div`
  display: flex;
  align-items: center;

  cursor: help;
`,Tooltip=styled_components_browser_esm.ZP.div`
  position: absolute;
  top: 30px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 320px;
  height: 100px;
  padding: 10px 20px;

  border: 1px solid ${({theme})=>theme.color.GRAY300};
  border-radius: 8px;
  background-color: ${({theme})=>theme.color.WHITE};

  & > p {
    line-height: 1.3;
  }
`,UrlContainer=styled_components_browser_esm.ZP.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid ${({theme})=>theme.color.GRAY300};
  border-radius: 8px;

  margin: 10px 0 20px 0;
`,UrlWrapper=styled_components_browser_esm.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 90%;
  height: 40px;
  padding: 0 8px;

  & > div {
    width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`,UserGuideLink=styled_components_browser_esm.ZP.a`
  align-self: flex-start;
`,closeButton=styled_components_browser_esm.iv`
  padding: 0;
`,copyButton=styled_components_browser_esm.iv`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 40px;
  padding: 0;

  background-color: ${({theme})=>theme.color.GRAY100};
  border-radius: 0 8px 8px 0;
`,shortcutText=styled_components_browser_esm.iv`
  color: ${({theme})=>theme.color.GRAY800};
`;var constants_url=__webpack_require__("./src/constants/url.ts");const ICalendarModal=props=>{const{calendarSize="md"}=props,{closeModal}=(0,useModal.d)(),{showToast}=(0,useToast.p)(),{teamPlaceId}=(0,useTeamPlace.l)(),{url}=(teamPlaceId=>{const{data}=(0,useQuery.a)(["iCalendarUrl",teamPlaceId],(()=>(0,schedule.Yx)(teamPlaceId)),{enabled:teamPlaceId>0,meta:{errorMessage:"일정 내보내기에 실패했습니다. \n지속되는 경우 관리자에게 문의해주세요."}});return data??{url:""}})(teamPlaceId),[isTooltipOpen,setIsTooltipOpen]=(0,react.useState)(!1);return(0,jsx_runtime.jsxs)(Modal.Z,{children:[(0,jsx_runtime.jsx)(Backdrop,{onClick:closeModal}),(0,jsx_runtime.jsxs)(Container,{calendarSize,children:[(0,jsx_runtime.jsxs)(Header,{children:[(0,jsx_runtime.jsx)(Text.Z,{as:"span",size:"xl",weight:"semiBold",children:"일정 내보내기"}),(0,jsx_runtime.jsx)(Spacing_Spacing,{size:8,direction:"horizontal"}),(0,jsx_runtime.jsxs)(TooltipWrapper,{tabIndex:0,onFocus:()=>setIsTooltipOpen(!0),onBlur:()=>setIsTooltipOpen(!1),onMouseEnter:()=>setIsTooltipOpen(!0),onMouseLeave:()=>setIsTooltipOpen(!1),children:[(0,jsx_runtime.jsx)(svg.UO,{}),isTooltipOpen&&(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:(0,jsx_runtime.jsx)(Tooltip,{role:"tooltip",children:(0,jsx_runtime.jsxs)(Text.Z,{children:["팀바팀 캘린더에 등록된 일정을 ",(0,jsx_runtime.jsx)("br",{}),"구글 캘린더, iOS 캘린더 앱 등에서 사용 가능한"," ",(0,jsx_runtime.jsx)(Text.Z,{as:"span",weight:"semiBold",children:".ics"})," ","파일로 내보내는 기능입니다."]})})})]}),(0,jsx_runtime.jsx)(Button.Z,{variant:"plain",type:"button",onClick:closeModal,"aria-label":"일정 내보내기 모달 닫기",css:closeButton,children:(0,jsx_runtime.jsx)(svg.Tw,{})})]}),(0,jsx_runtime.jsx)(Spacing_Spacing,{size:16}),(0,jsx_runtime.jsx)(Text.Z,{as:"span",weight:"semiBold",children:"일정 파일(.ics) 경로"}),(0,jsx_runtime.jsxs)(UrlContainer,{children:[(0,jsx_runtime.jsx)(UrlWrapper,{children:(0,jsx_runtime.jsx)("div",{title:url,children:(0,jsx_runtime.jsx)(Text.Z,{as:"span",children:""===url?"경로를 불러오는 데 실패했습니다.":url})})}),(0,jsx_runtime.jsx)(Button.Z,{type:"button",variant:"plain",css:copyButton,onClick:()=>{if(""!==url)try{navigator.clipboard.writeText(url),showToast("success","일정 파일(.ics) 경로가 복사되었습니다.")}catch(error){showToast("error","일정 파일(.ics) 경로 복사에 실패했습니다.")}},"aria-label":"일정 내보내기 링크 복사하기",disabled:""===url,children:(0,jsx_runtime.jsx)(svg.Km,{})})]}),(0,jsx_runtime.jsx)(UserGuideLink,{href:constants_url.sE,target:"_blank",rel:"noreferrer",children:(0,jsx_runtime.jsx)(Text.Z,{as:"span",size:"lg",weight:"semiBold",css:shortcutText,children:"📘 일정 파일(.ics) 사용법"})})]})]})};ICalendarModal.displayName="ICalendarModal";const ICalendarModal_ICalendarModal=ICalendarModal;try{ICalendarModal.displayName="ICalendarModal",ICalendarModal.__docgenInfo={description:"",displayName:"ICalendarModal",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/ICalendarModal/ICalendarModal.tsx#ICalendarModal"]={docgenInfo:ICalendarModal.__docgenInfo,name:"ICalendarModal",path:"src/components/team_calendar/ICalendarModal/ICalendarModal.tsx#ICalendarModal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/ScheduleAddModal/ScheduleAddModal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ScheduleAddModal_ScheduleAddModal});var styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Backdrop=styled_components_browser_esm.zo.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`,Container=styled_components_browser_esm.zo.div`
  position: fixed;
  ${({calendarSize})=>"md"===calendarSize?styled_components_browser_esm.iv`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `:"sm"===calendarSize?styled_components_browser_esm.iv`
        top: 20%;
        left: 13.5%;
      `:void 0}
  display: flex;
  flex-direction: column;

  width: 496px;
  min-height: 400px;
  padding: 20px 30px;

  border-radius: 10px;
  box-shadow:
    0 0 1px #1b1d1f33,
    0 15px 25px #1b1d1f33,
    0 5px 10px #1b1d1f1f;
  background-color: ${({theme})=>theme.color.WHITE};

  & > form {
    display: flex;
    flex-direction: column;

    row-gap: 24px;
  }
`,Header=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: flex-end;

  width: 100%;
  height: 38px;
  margin-bottom: 22px;

  border-bottom: ${({theme})=>`1px solid ${theme.color.GRAY300}`};
`,TitleWrapper=styled_components_browser_esm.zo.div`
  width: 100%;
  height: 51px;
`,InnerContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`,CheckboxContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  column-gap: 8px;
`,TimeSelectContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: 40px;

  column-gap: 10px;
`,InputWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(100% - 100px);

  margin-left: auto;
`,TeamNameContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  height: 23px;

  gap: 5px;
`,ControlButtonWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: flex-end;

  width: 100%;
  height: 40px;
`,title=styled_components_browser_esm.iv`
  padding: 10px 20px;

  border: none;
  border-radius: 10px;
  background-color: ${({theme})=>theme.color.GRAY200};

  font-size: 24px;
`,closeButton=styled_components_browser_esm.iv`
  width: 22px;
  height: 38px;
  padding: 8px 0;
`,dateTimeLocalInput=(styled_components_browser_esm.iv`
  width: 150px;
  height: 40px;

  border: 1px solid ${({theme})=>theme.color.GRAY200};
  border-radius: 4px;
`,styled_components_browser_esm.iv`
  border-radius: 4px;

  text-align: center;
`),teamPlaceName=styled_components_browser_esm.iv`
  overflow: hidden;

  max-width: 250px;

  text-overflow: ellipsis;
  white-space: nowrap;
`,submitButton=styled_components_browser_esm.iv`
  width: 90px;
`;var useModal=__webpack_require__("./src/hooks/useModal.ts"),svg=__webpack_require__("./src/assets/svg/index.ts"),Modal=__webpack_require__("./src/components/common/Modal/Modal.tsx"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),Button=__webpack_require__("./src/components/common/Button/Button.tsx"),Input=__webpack_require__("./src/components/common/Input/Input.tsx"),react=__webpack_require__("./node_modules/react/index.js"),QueryClientProvider=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs"),useMutation=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useMutation.mjs"),schedule=__webpack_require__("./src/apis/schedule.ts");const useSendSchedule=teamPlaceId=>{const queryClient=(0,QueryClientProvider.NL)(),{mutate}=(0,useMutation.D)((body=>(0,schedule.wV)(teamPlaceId,body)),{onSuccess:()=>{queryClient.invalidateQueries(["schedules",teamPlaceId]),queryClient.invalidateQueries(["mySchedules"]),queryClient.invalidateQueries(["myDailySchedules"])}});return{mutateSendSchedule:mutate}};var typeGuard=__webpack_require__("./src/types/typeGuard.ts"),parseDate=__webpack_require__("./src/utils/parseDate.ts"),useToast=__webpack_require__("./src/hooks/useToast.ts"),useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts");const schedule_useScheduleAddModal=clickedDate=>{const{year,month,date}=(0,parseDate.s)(clickedDate),dateString=`${year}-${String(month+1).padStart(2,"0")}-${String(date).padStart(2,"0")}`,[schedule,setSchedule]=(0,react.useState)({title:"",startDateTime:dateString,endDateTime:dateString}),[times,setTimes]=(0,react.useState)({startTime:"09:00",endTime:"10:00"}),[isAllDay,setIsAllDay]=(0,react.useState)(!1),{closeModal}=(0,useModal.d)(),{showToast}=(0,useToast.p)(),{teamPlaceId}=(0,useTeamPlace.l)(),{mutateSendSchedule}=useSendSchedule(teamPlaceId),isValidEndTime=(startTime,endTime)=>{const{startDateTime,endDateTime}=schedule;return new Date(`${startDateTime} ${startTime}`)<new Date(`${endDateTime} ${endTime}`)};return{schedule,isAllDay,times,handlers:{handleScheduleChange:e=>{const{name,value}=e.target;setSchedule((prev=>({...prev,[name]:value})))},handleIsAllDayChange:()=>{setIsAllDay((prev=>!prev))},handleStartTimeChange:value=>{isValidEndTime(value,times.endTime)?setTimes((prev=>({...prev,startTime:value}))):setTimes((prev=>({...prev,startTime:value,endTime:value})))},handleEndTimeChange:value=>{isValidEndTime(times.startTime,value)?setTimes((prev=>({...prev,endTime:value}))):setTimes((prev=>({...prev,endTime:prev.startTime})))},handleScheduleSubmit:e=>{e.preventDefault();const{title,startDateTime,endDateTime}=schedule,{startTime,endTime}=times,formattedStartDateTime=`${startDateTime} ${isAllDay?"00:00":startTime}`,formattedEndDateTime=`${endDateTime} ${isAllDay?"23:59":endTime}`;(0,typeGuard.r)(formattedStartDateTime)&&(0,typeGuard.r)(formattedEndDateTime)&&(isValidEndTime(startTime,endTime)||isAllDay?mutateSendSchedule({title,startDateTime:formattedStartDateTime,endDateTime:formattedEndDateTime},{onSuccess:()=>{showToast("success","일정이 등록되었습니다."),closeModal()},onError:error=>{500===error.status&&showToast("error","일정 제목이 최대 글자(250자)를 초과했습니다.")}}):showToast("error","마감 시간은 시작 시간 이후여야 합니다."))}}}};var Checkbox=__webpack_require__("./src/components/common/Checkbox/Checkbox.tsx"),TeamBadge=__webpack_require__("./src/components/team/TeamBadge/TeamBadge.tsx"),TimeTableMenu=__webpack_require__("./src/components/team_calendar/TimeTableMenu/TimeTableMenu.tsx"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ScheduleAddModal=props=>{const{clickedDate,calendarSize="md"}=props,{closeModal}=(0,useModal.d)(),{teamPlaceColor,displayName}=(0,useTeamPlace.l)(),{schedule,isAllDay,times,handlers:{handleScheduleChange,handleIsAllDayChange,handleStartTimeChange,handleEndTimeChange,handleScheduleSubmit}}=schedule_useScheduleAddModal(clickedDate),titleInputRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{titleInputRef.current?.focus()}),[]),(0,jsx_runtime.jsxs)(Modal.Z,{children:[(0,jsx_runtime.jsx)(Backdrop,{onClick:closeModal}),(0,jsx_runtime.jsxs)(Container,{calendarSize,children:[(0,jsx_runtime.jsx)(Header,{children:(0,jsx_runtime.jsx)(Button.Z,{variant:"plain",type:"button",onClick:closeModal,css:closeButton,"aria-label":"일정 등록 모달 닫기",children:(0,jsx_runtime.jsx)(svg.Tw,{})})}),(0,jsx_runtime.jsxs)("form",{onSubmit:handleScheduleSubmit,children:[(0,jsx_runtime.jsx)(TitleWrapper,{children:(0,jsx_runtime.jsx)(Input.Z,{width:"100%",height:"100%",placeholder:"일정 제목을 입력해주세요.",css:title,name:"title",maxLength:250,value:schedule.title,ref:titleInputRef,required:!0,onChange:handleScheduleChange})}),(0,jsx_runtime.jsxs)(TimeSelectContainer,{children:[(0,jsx_runtime.jsx)(Text.Z,{size:"xxl",weight:"bold",children:"일정 시작"}),(0,jsx_runtime.jsxs)(InputWrapper,{children:[(0,jsx_runtime.jsx)(Input.Z,{width:isAllDay?"100%":"50%",height:"40px",type:"date",css:dateTimeLocalInput,name:"startDateTime",value:schedule.startDateTime,onChange:handleScheduleChange,"aria-label":`일정 시작 일자는 ${schedule.startDateTime} 입니다`,required:!0}),!isAllDay&&(0,jsx_runtime.jsx)(TimeTableMenu.Z,{displayValue:times.startTime,onSelect:handleStartTimeChange})]})]}),(0,jsx_runtime.jsxs)(TimeSelectContainer,{children:[(0,jsx_runtime.jsx)(Text.Z,{size:"xxl",weight:"bold",children:"일정 마감"}),(0,jsx_runtime.jsxs)(InputWrapper,{children:[(0,jsx_runtime.jsx)(Input.Z,{width:isAllDay?"100%":"50%",height:"40px",type:"date",css:dateTimeLocalInput,name:"endDateTime",value:schedule.endDateTime,"aria-label":`일정 마감 일자는 ${schedule.endDateTime} 입니다`,onChange:handleScheduleChange,required:!0}),!isAllDay&&(0,jsx_runtime.jsx)(TimeTableMenu.Z,{displayValue:times.endTime,onSelect:handleEndTimeChange})]})]}),(0,jsx_runtime.jsxs)(CheckboxContainer,{children:[(0,jsx_runtime.jsx)(Text.Z,{size:"xl",weight:"bold",children:"종일"}),(0,jsx_runtime.jsx)(Checkbox.Z,{isChecked:isAllDay,onChange:handleIsAllDayChange}),(0,jsx_runtime.jsx)("p",{className:"hidden","aria-live":"assertive","aria-relevant":"additions",children:isAllDay?"종일 일정이 선택되었습니다.":"종일 일정이 해제되었습니다."})]}),(0,jsx_runtime.jsxs)(InnerContainer,{children:[(0,jsx_runtime.jsxs)(TeamNameContainer,{title:displayName,children:[(0,jsx_runtime.jsx)(TeamBadge.Z,{teamPlaceColor,size:"lg"}),(0,jsx_runtime.jsx)(Text.Z,{css:teamPlaceName,children:displayName})]}),(0,jsx_runtime.jsx)(ControlButtonWrapper,{children:(0,jsx_runtime.jsx)(Button.Z,{variant:"primary",css:submitButton,children:"등록"})})]})]})]})]})};ScheduleAddModal.displayName="ScheduleAddModal";const ScheduleAddModal_ScheduleAddModal=ScheduleAddModal;try{ScheduleAddModal.displayName="ScheduleAddModal",ScheduleAddModal.__docgenInfo={description:"",displayName:"ScheduleAddModal",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}},clickedDate:{defaultValue:null,description:"",name:"clickedDate",required:!0,type:{name:"Date"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/ScheduleAddModal/ScheduleAddModal.tsx#ScheduleAddModal"]={docgenInfo:ScheduleAddModal.__docgenInfo,name:"ScheduleAddModal",path:"src/components/team_calendar/ScheduleAddModal/ScheduleAddModal.tsx#ScheduleAddModal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/ScheduleBar/ScheduleBar.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ScheduleBar_ScheduleBar});var Text=__webpack_require__("./src/components/common/Text/Text.tsx"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Wrapper=styled_components_browser_esm.zo.div`
  position: absolute;
  ${({calendarSize,level})=>"md"===calendarSize?styled_components_browser_esm.iv`
        top: ${18*level+36}px;
        height: 16px;
      `:"sm"===calendarSize?styled_components_browser_esm.iv`
        top: ${14*level+22}px;
        height: 12px;
      `:void 0}

  left: ${({column})=>100*column/7}%;

  width: ${({duration})=>100*duration/7}%;

  padding: ${({roundedStart,roundedEnd})=>`0 ${roundedEnd?"4px":0} 0 ${roundedStart?"4px":0}`};
`,Inner=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 100%;
  padding-left: 6px;

  background-color: ${({theme,teamPlaceColor=0})=>theme.teamColor[teamPlaceColor]};
  border-radius: ${({roundedStart,roundedEnd})=>`${roundedStart?"4px":"0"} ${roundedEnd?"4px 4px":"0 0"} ${roundedStart?"4px":"0"}`};

  filter: brightness(${({level})=>1+.4*level});

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`,scheduleBarTitle=calendarSize=>styled_components_browser_esm.iv`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 100px;
  height: 100%;

  font-size: ${"md"===calendarSize?12:10}px;
  color: ${({theme})=>theme.color.WHITE};
`;var svg=__webpack_require__("./src/assets/svg/index.ts"),useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ScheduleBar=props=>{const{title,onClick,roundedEnd,calendarSize="md",...rest}=props,{teamPlaceColor}=(0,useTeamPlace.l)();return(0,jsx_runtime.jsx)(Wrapper,{title,onClick,roundedEnd,calendarSize,...rest,children:(0,jsx_runtime.jsxs)(Inner,{teamPlaceColor,roundedEnd,...rest,children:[(0,jsx_runtime.jsx)(Text.Z,{as:"span",css:scheduleBarTitle(calendarSize),children:title}),!roundedEnd&&(0,jsx_runtime.jsx)(svg.yr,{})]})})};ScheduleBar.displayName="ScheduleBar";const ScheduleBar_ScheduleBar=ScheduleBar;try{ScheduleBar.displayName="ScheduleBar",ScheduleBar.__docgenInfo={description:"",displayName:"ScheduleBar",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},scheduleId:{defaultValue:null,description:"",name:"scheduleId",required:!0,type:{name:"number"}},schedule:{defaultValue:null,description:"",name:"schedule",required:!0,type:{name:"Schedule"}},title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},row:{defaultValue:null,description:"",name:"row",required:!0,type:{name:"number"}},column:{defaultValue:null,description:"",name:"column",required:!0,type:{name:"number"}},duration:{defaultValue:null,description:"",name:"duration",required:!0,type:{name:"number"}},level:{defaultValue:null,description:"",name:"level",required:!0,type:{name:"number"}},roundedStart:{defaultValue:null,description:"",name:"roundedStart",required:!0,type:{name:"boolean"}},roundedEnd:{defaultValue:null,description:"",name:"roundedEnd",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/ScheduleBar/ScheduleBar.tsx#ScheduleBar"]={docgenInfo:ScheduleBar.__docgenInfo,name:"ScheduleBar",path:"src/components/team_calendar/ScheduleBar/ScheduleBar.tsx#ScheduleBar"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/ScheduleEditModal/ScheduleEditModal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ScheduleEditModal_ScheduleEditModal});var Modal=__webpack_require__("./src/components/common/Modal/Modal.tsx"),useModal=__webpack_require__("./src/hooks/useModal.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Backdrop=styled_components_browser_esm.zo.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`,Container=styled_components_browser_esm.zo.div`
  position: fixed;
  ${({calendarSize})=>"md"===calendarSize?styled_components_browser_esm.iv`
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `:"sm"===calendarSize?styled_components_browser_esm.iv`
        top: 20%;
        left: 13.5%;
      `:void 0}
  display: flex;
  flex-direction: column;

  width: 496px;
  min-height: 400px;
  padding: 20px 30px;

  border-radius: 10px;
  box-shadow:
    0 0 1px #1b1d1f33,
    0 15px 25px #1b1d1f33,
    0 5px 10px #1b1d1f1f;
  background-color: ${({theme})=>theme.color.WHITE};

  & > form {
    display: flex;
    flex-direction: column;

    row-gap: 24px;
  }
`,Header=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: flex-end;

  width: 100%;
  height: 38px;
  margin-bottom: 22px;

  border-bottom: ${({theme})=>`1px solid ${theme.color.GRAY300}`};
`,TitleWrapper=styled_components_browser_esm.zo.div`
  width: 100%;
  height: 51px;
`,InnerContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`,CheckboxContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  column-gap: 8px;
`,TimeSelectContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: 40px;

  column-gap: 10px;
`,InputWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: calc(100% - 100px);

  margin-left: auto;
`,TeamNameContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;

  height: 23px;

  gap: 5px;
`,ControlButtonWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: flex-end;

  width: 100%;
  height: 40px;
`,title=styled_components_browser_esm.iv`
  padding: 10px 20px;

  border: none;
  border-radius: 10px;
  background-color: ${({theme})=>theme.color.GRAY200};

  font-size: 24px;
`,closeButton=styled_components_browser_esm.iv`
  width: 22px;
  height: 38px;
  padding: 8px 0;
`,dateTimeLocalInput=styled_components_browser_esm.iv`
  border-radius: 4px;

  text-align: center;
`,teamPlaceName=styled_components_browser_esm.iv`
  overflow: hidden;

  max-width: 250px;

  text-overflow: ellipsis;
  white-space: nowrap;
`,submitButton=styled_components_browser_esm.iv`
  width: 90px;
`;var Button=__webpack_require__("./src/components/common/Button/Button.tsx"),svg=__webpack_require__("./src/assets/svg/index.ts"),Input=__webpack_require__("./src/components/common/Input/Input.tsx"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),react=__webpack_require__("./node_modules/react/index.js"),QueryClientProvider=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs"),useMutation=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useMutation.mjs"),schedule=__webpack_require__("./src/apis/schedule.ts");const useModifySchedule=(teamPlaceId,scheduleId)=>{const queryClient=(0,QueryClientProvider.NL)(),{mutate}=(0,useMutation.D)((body=>(0,schedule.Tg)(teamPlaceId,scheduleId,body)),{onSuccess:()=>{queryClient.invalidateQueries(["schedules",teamPlaceId]),queryClient.invalidateQueries(["schedule",teamPlaceId,scheduleId]),queryClient.invalidateQueries(["mySchedules"]),queryClient.invalidateQueries(["myDailySchedules"])}});return{mutateModifySchedule:mutate}};var typeGuard=__webpack_require__("./src/types/typeGuard.ts"),useToast=__webpack_require__("./src/hooks/useToast.ts"),useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts");const schedule_useScheduleEditModal=(scheduleId,initialSchedule)=>{const{teamPlaceId}=(0,useTeamPlace.l)(),[startDate,startTime]=initialSchedule?.startDateTime.split(" ")??[""],[endDate,endTime]=initialSchedule?.endDateTime.split(" ")??[""],[schedule,setSchedule]=(0,react.useState)({title:initialSchedule?.title,startDate,endDate}),[times,setTimes]=(0,react.useState)({startTime,endTime:"23:59"===endTime?"23:30":endTime}),[isAllDay,setIsAllDay]=(0,react.useState)("23:59"===endTime),{closeModal}=(0,useModal.d)(),{showToast}=(0,useToast.p)(),{mutateModifySchedule}=useModifySchedule(teamPlaceId,scheduleId),isValidEndTime=(startTime,endTime)=>{const{startDate,endDate}=schedule;return new Date(`${startDate} ${startTime}`)<new Date(`${endDate} ${endTime}`)};return{schedule,times,isAllDay,handlers:{handleScheduleChange:e=>{const{name,value}=e.target;setSchedule((prev=>({...prev,[name]:value})))},handleScheduleSubmit:e=>{e.preventDefault();const{title,startDate,endDate}=schedule,{startTime,endTime}=times;if("string"!=typeof title||"string"!=typeof startDate||"string"!=typeof endDate)return;const formattedStartDateTime=`${startDate} ${isAllDay?"00:00":startTime}`,formattedEndDateTime=`${endDate} ${isAllDay?"23:59":endTime}`;(0,typeGuard.r)(formattedStartDateTime)&&(0,typeGuard.r)(formattedEndDateTime)&&mutateModifySchedule({title,startDateTime:formattedStartDateTime,endDateTime:formattedEndDateTime},{onSuccess:()=>{showToast("success","일정이 수정되었습니다."),closeModal()},onError:error=>{500===error.status&&showToast("error","일정 제목이 최대 글자(250자)를 초과했습니다.")}})},handleStartTimeChange:value=>{isValidEndTime(value,times.endTime)?setTimes((prev=>({...prev,startTime:value}))):setTimes((prev=>({...prev,startTime:value,endTime:value})))},handleEndTimeChange:value=>{isValidEndTime(times.startTime,value)?setTimes((prev=>({...prev,endTime:value}))):setTimes((prev=>({...prev,endTime:prev.startTime})))},handleIsAllDayChange:()=>{setIsAllDay((prev=>!prev))}}}};var TeamBadge=__webpack_require__("./src/components/team/TeamBadge/TeamBadge.tsx"),TimeTableMenu=__webpack_require__("./src/components/team_calendar/TimeTableMenu/TimeTableMenu.tsx"),Checkbox=__webpack_require__("./src/components/common/Checkbox/Checkbox.tsx"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ScheduleEditModal=props=>{const{scheduleId,initialSchedule,calendarSize="md"}=props,{closeModal}=(0,useModal.d)(),{teamPlaceColor,displayName}=(0,useTeamPlace.l)(),{schedule,times,isAllDay,handlers:{handleScheduleChange,handleScheduleSubmit,handleStartTimeChange,handleEndTimeChange,handleIsAllDayChange}}=schedule_useScheduleEditModal(scheduleId,initialSchedule);return void 0===initialSchedule?null:(0,jsx_runtime.jsxs)(Modal.Z,{children:[(0,jsx_runtime.jsx)(Backdrop,{onClick:closeModal}),(0,jsx_runtime.jsxs)(Container,{calendarSize,children:[(0,jsx_runtime.jsx)(Header,{children:(0,jsx_runtime.jsx)(Button.Z,{variant:"plain",type:"button",onClick:closeModal,css:closeButton,"aria-label":"닫기",children:(0,jsx_runtime.jsx)(svg.Tw,{})})}),(0,jsx_runtime.jsxs)("form",{onSubmit:handleScheduleSubmit,children:[(0,jsx_runtime.jsx)(TitleWrapper,{children:(0,jsx_runtime.jsx)(Input.Z,{width:"100%",height:"100%",placeholder:"일정 제목",css:title,name:"title",value:schedule.title,required:!0,onChange:handleScheduleChange})}),(0,jsx_runtime.jsxs)(TimeSelectContainer,{children:[(0,jsx_runtime.jsx)(Text.Z,{size:"xxl",weight:"bold",children:"일정 시작"}),(0,jsx_runtime.jsxs)(InputWrapper,{children:[(0,jsx_runtime.jsx)(Input.Z,{width:isAllDay?"100%":"50%",height:"40px",type:"date",css:dateTimeLocalInput,name:"startDate",value:schedule.startDate,onChange:handleScheduleChange,required:!0}),!isAllDay&&(0,jsx_runtime.jsx)(TimeTableMenu.Z,{displayValue:times.startTime,onSelect:handleStartTimeChange})]})]}),(0,jsx_runtime.jsxs)(TimeSelectContainer,{children:[(0,jsx_runtime.jsx)(Text.Z,{size:"xxl",weight:"bold",children:"일정 마감"}),(0,jsx_runtime.jsxs)(InputWrapper,{children:[(0,jsx_runtime.jsx)(Input.Z,{width:isAllDay?"100%":"50%",height:"40px",type:"date",css:dateTimeLocalInput,name:"endDate",value:schedule.endDate,min:schedule.startDate,onChange:handleScheduleChange,required:!0}),!isAllDay&&(0,jsx_runtime.jsx)(TimeTableMenu.Z,{displayValue:times.endTime,onSelect:handleEndTimeChange})]})]}),(0,jsx_runtime.jsxs)(CheckboxContainer,{children:[(0,jsx_runtime.jsx)(Text.Z,{size:"xl",weight:"bold",children:"종일"}),(0,jsx_runtime.jsx)(Checkbox.Z,{isChecked:isAllDay,onChange:handleIsAllDayChange})]}),(0,jsx_runtime.jsxs)(InnerContainer,{children:[(0,jsx_runtime.jsxs)(TeamNameContainer,{title:displayName,children:[(0,jsx_runtime.jsx)(TeamBadge.Z,{teamPlaceColor,size:"lg"}),(0,jsx_runtime.jsx)(Text.Z,{css:teamPlaceName,children:displayName})]}),(0,jsx_runtime.jsx)(ControlButtonWrapper,{children:(0,jsx_runtime.jsx)(Button.Z,{variant:"primary",css:submitButton,children:"수정"})})]})]})]})]})};ScheduleEditModal.displayName="ScheduleEditModal";const ScheduleEditModal_ScheduleEditModal=ScheduleEditModal;try{ScheduleEditModal.displayName="ScheduleEditModal",ScheduleEditModal.__docgenInfo={description:"",displayName:"ScheduleEditModal",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}},scheduleId:{defaultValue:null,description:"",name:"scheduleId",required:!0,type:{name:"number"}},initialSchedule:{defaultValue:null,description:"",name:"initialSchedule",required:!1,type:{name:"Schedule"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/ScheduleEditModal/ScheduleEditModal.tsx#ScheduleEditModal"]={docgenInfo:ScheduleEditModal.__docgenInfo,name:"ScheduleEditModal",path:"src/components/team_calendar/ScheduleEditModal/ScheduleEditModal.tsx#ScheduleEditModal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/ScheduleModal/ScheduleModal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ScheduleModal_ScheduleModal});var Modal=__webpack_require__("./src/components/common/Modal/Modal.tsx"),Text=__webpack_require__("./src/components/common/Text/Text.tsx"),useModal=__webpack_require__("./src/hooks/useModal.ts"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Container=styled_components_browser_esm.zo.div`
  display: flex;
  flex-direction: column;
  z-index: ${({theme})=>theme.zIndex.MODAL};
  gap: 28px;

  width: 551px;
  height: 272px;
  padding: 20px 30px 30px 40px;

  border-radius: 10px;
  background-color: ${({theme})=>theme.color.WHITE};

  box-shadow:
    0 0 1px #1b1d1f33,
    0 15px 25px #1b1d1f33,
    0 5px 10px #1b1d1f1f;

  ${({css})=>css};
`,Backdrop=styled_components_browser_esm.zo.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`,Header=styled_components_browser_esm.zo.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,TeamWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  gap: 12px;
`,MenuContainer=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`,PeriodWrapper=styled_components_browser_esm.zo.div`
  display: flex;
  align-items: center;
  gap: 2px;
`,teamName=styled_components_browser_esm.iv`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  max-width: 200px;
`,menuIcon=styled_components_browser_esm.iv`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  padding: 0;

  border-radius: 8px;

  &:hover {
    background-color: ${({theme})=>theme.color.GRAY100};
  }
`,closeButton=styled_components_browser_esm.iv`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;

  width: 96px;
  height: 42px;
  padding: 10px 30px;

  cursor: pointer;
`,modalLocation=(row,column,level,calendarWidth,calendarLeft,calendarSize)=>"md"===calendarSize?styled_components_browser_esm.iv`
      position: absolute;
      top: ${(row<3?92:-199)+110*(row+1)+18*level}px;
      left: ${(column>3?calendarWidth/7-550:3===column?calendarWidth/14-275:0)+calendarLeft+calendarWidth*column/7}px;
    `:"sm"==calendarSize?styled_components_browser_esm.iv`
      position: fixed;
      top: 26%;
      left: 12%;
    `:void 0,scheduleTitleText=styled_components_browser_esm.iv`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  width: 100%;
`;var svg=__webpack_require__("./src/assets/svg/index.ts"),Button=__webpack_require__("./src/components/common/Button/Button.tsx");const formatDateTime=rawDateTime=>{const[rawDate,time]=rawDateTime.split(" "),date=rawDate.split("-");return`${date[0]}년 ${date[1]}월 ${date[2]}일 ${time}`};var useQuery=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useQuery.mjs"),schedule=__webpack_require__("./src/apis/schedule.ts");var QueryClientProvider=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/QueryClientProvider.mjs"),useMutation=__webpack_require__("./node_modules/@tanstack/react-query/build/lib/useMutation.mjs");var TeamBadge=__webpack_require__("./src/components/team/TeamBadge/TeamBadge.tsx"),useToast=__webpack_require__("./src/hooks/useToast.ts"),useTeamPlace=__webpack_require__("./src/hooks/useTeamPlace.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ScheduleModal=props=>{const{calendarWidth,calendarLeft,scheduleId,position,onOpenScheduleEditModal,calendarSize="md"}=props,{closeModal}=(0,useModal.d)(),{showToast}=(0,useToast.p)(),{teamPlaceColor,teamPlaceId,displayName}=(0,useTeamPlace.l)(),{scheduleById}=((teamPlaceId,scheduleId)=>{const{data:scheduleById}=(0,useQuery.a)(["schedule",teamPlaceId,scheduleId],(()=>(0,schedule.e4)(teamPlaceId,scheduleId)),{enabled:teamPlaceId>0});return{scheduleById}})(teamPlaceId,scheduleId),{mutateDeleteSchedule}=((teamPlaceId,scheduleId)=>{const queryClient=(0,QueryClientProvider.NL)(),{mutate}=(0,useMutation.D)((()=>(0,schedule.wn)(teamPlaceId,scheduleId)),{onSuccess:()=>{queryClient.invalidateQueries(["schedules",teamPlaceId]),queryClient.removeQueries(["schedule",teamPlaceId,scheduleId]),queryClient.invalidateQueries(["mySchedules"]),queryClient.invalidateQueries(["myDailySchedules"])},onError:()=>{throw alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요."),new Error}});return{mutateDeleteSchedule:mutate}})(teamPlaceId,scheduleId);if(void 0===scheduleById)return;const{title,startDateTime,endDateTime}=scheduleById,{row,column,level}=position;return(0,jsx_runtime.jsxs)(Modal.Z,{children:[(0,jsx_runtime.jsx)(Backdrop,{onClick:closeModal}),(0,jsx_runtime.jsxs)(Container,{css:modalLocation(row,column,level,calendarWidth,calendarLeft,calendarSize),children:[(0,jsx_runtime.jsxs)(Header,{children:[(0,jsx_runtime.jsxs)(TeamWrapper,{children:[(0,jsx_runtime.jsx)(TeamBadge.Z,{teamPlaceColor,size:"lg"}),(0,jsx_runtime.jsx)("div",{title:displayName,children:(0,jsx_runtime.jsx)(Text.Z,{css:teamName,children:displayName})})]}),(0,jsx_runtime.jsxs)(MenuContainer,{children:[(0,jsx_runtime.jsx)(Button.Z,{type:"button",variant:"plain",onClick:onOpenScheduleEditModal,css:menuIcon,children:(0,jsx_runtime.jsx)(svg.dY,{})}),(0,jsx_runtime.jsx)(Button.Z,{type:"button",variant:"plain",onClick:()=>{confirm("일정을 삭제하시겠어요?")&&mutateDeleteSchedule(void 0,{onSuccess:()=>{showToast("success","일정이 삭제되었습니다."),closeModal()}})},css:menuIcon,children:(0,jsx_runtime.jsx)(svg.pJ,{})}),(0,jsx_runtime.jsx)(Button.Z,{type:"button",variant:"plain",onClick:closeModal,css:menuIcon,children:(0,jsx_runtime.jsx)(svg.Tw,{})})]})]}),(0,jsx_runtime.jsx)(Text.Z,{as:"h4",css:scheduleTitleText,children:title}),(0,jsx_runtime.jsxs)(PeriodWrapper,{children:[(0,jsx_runtime.jsx)("time",{children:(0,jsx_runtime.jsx)(Text.Z,{size:"lg",children:formatDateTime(startDateTime)})}),(0,jsx_runtime.jsx)(Text.Z,{size:"lg",children:"~"}),(0,jsx_runtime.jsx)("time",{children:(0,jsx_runtime.jsx)(Text.Z,{size:"lg",children:formatDateTime(endDateTime)})})]}),(0,jsx_runtime.jsx)(Button.Z,{type:"button",variant:"primary",css:closeButton,onClick:closeModal,children:"확인"})]})]})};ScheduleModal.displayName="ScheduleModal";const ScheduleModal_ScheduleModal=ScheduleModal;try{ScheduleModal.displayName="ScheduleModal",ScheduleModal.__docgenInfo={description:"",displayName:"ScheduleModal",props:{calendarWidth:{defaultValue:null,description:"",name:"calendarWidth",required:!0,type:{name:"number"}},calendarLeft:{defaultValue:null,description:"",name:"calendarLeft",required:!0,type:{name:"number"}},calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}},scheduleId:{defaultValue:null,description:"",name:"scheduleId",required:!0,type:{name:"number"}},position:{defaultValue:null,description:"",name:"position",required:!0,type:{name:"SchedulePosition"}},onOpenScheduleEditModal:{defaultValue:null,description:"",name:"onOpenScheduleEditModal",required:!0,type:{name:"() => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/ScheduleModal/ScheduleModal.tsx#ScheduleModal"]={docgenInfo:ScheduleModal.__docgenInfo,name:"ScheduleModal",path:"src/components/team_calendar/ScheduleModal/ScheduleModal.tsx#ScheduleModal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/team_calendar/ScheduleMoreCell/ScheduleMoreCell.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ScheduleMoreCell_ScheduleMoreCell});var styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Wrapper=styled_components_browser_esm.zo.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${({calendarSize})=>"md"===calendarSize?90:62}px;
  left: ${({column})=>100*column/7}%;

  width: calc(100% / 7);
  height: 16px;

  cursor: pointer;
  &:hover {
    background-color: ${({theme})=>theme.color.GRAY200};
  }

  @media screen and (max-width: 800px) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`,moreText=styled_components_browser_esm.iv`
  color: ${({theme})=>theme.color.GRAY500};
`;var Text=__webpack_require__("./src/components/common/Text/Text.tsx"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ScheduleMoreCell=props=>{const{column,onClick,calendarSize="md"}=props;return(0,jsx_runtime.jsx)(Wrapper,{column,calendarSize,onClick,children:(0,jsx_runtime.jsx)(Text.Z,{size:"xs",css:moreText,children:"일정 더보기"})})};ScheduleMoreCell.displayName="ScheduleMoreCell";const ScheduleMoreCell_ScheduleMoreCell=ScheduleMoreCell;try{ScheduleMoreCell.displayName="ScheduleMoreCell",ScheduleMoreCell.__docgenInfo={description:"",displayName:"ScheduleMoreCell",props:{calendarSize:{defaultValue:null,description:"",name:"calendarSize",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'}]}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},column:{defaultValue:null,description:"",name:"column",required:!0,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/team_calendar/ScheduleMoreCell/ScheduleMoreCell.tsx#ScheduleMoreCell"]={docgenInfo:ScheduleMoreCell.__docgenInfo,name:"ScheduleMoreCell",path:"src/components/team_calendar/ScheduleMoreCell/ScheduleMoreCell.tsx#ScheduleMoreCell"})}catch(__react_docgen_typescript_loader_error){}},"./src/constants/url.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D_:()=>TEAM_BY_TEAM_REPOSITORY,Mx:()=>TEAM_BY_TEAM_HOW_TO_USE_URL,O8:()=>USER_FEEDBACK_URL,sE:()=>ICALENDAR_USER_GUIDE_URL});const ICALENDAR_USER_GUIDE_URL="https://teambyteam.notion.site/a99a38a030d74be88e761a1dcb1559a1",USER_FEEDBACK_URL="https://forms.gle/Tk8DZ5Xzsc5615Ar7",TEAM_BY_TEAM_HOW_TO_USE_URL="https://teambyteam.notion.site/f84827ca26334913a1c724dfb9436887",TEAM_BY_TEAM_REPOSITORY="https://github.com/woowacourse-teams/2023-team-by-team"},"./src/hooks/useCalendar.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_constants_calendar__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/constants/calendar.ts"),_utils_arrayOf__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/utils/arrayOf.ts"),_utils_parseDate__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/utils/parseDate.ts");const __WEBPACK_DEFAULT_EXPORT__=()=>{const[currentDate,setCurrentDate]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(new Date),{year,month,date}=(0,_utils_parseDate__WEBPACK_IMPORTED_MODULE_2__.s)(currentDate),{day:startDayOfMonth}=(0,_utils_parseDate__WEBPACK_IMPORTED_MODULE_2__.s)(new Date(year,month,1)),today=(0,_utils_parseDate__WEBPACK_IMPORTED_MODULE_2__.s)(new Date),calendar=((year,month)=>(0,_utils_arrayOf__WEBPACK_IMPORTED_MODULE_3__.C)(_constants_calendar__WEBPACK_IMPORTED_MODULE_1__.XN.ROW_SIZE).map((weekIndex=>(0,_utils_arrayOf__WEBPACK_IMPORTED_MODULE_3__.C)(_constants_calendar__WEBPACK_IMPORTED_MODULE_1__.XN.COLUMN_SIZE).map((dayIndex=>new Date(year,month,7*weekIndex+dayIndex-startDayOfMonth+1))))))(year,month);return{year,month,calendar,currentDate,today,handlers:{handlePrevButtonClick:()=>{setCurrentDate((()=>new Date(year,month-1,date)))},handleNextButtonClick:()=>{setCurrentDate((()=>new Date(year,month+1,date)))}}}}},"./src/utils/getDateByPosition.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{S:()=>getDateByPosition});var _constants_calendar__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/constants/calendar.ts");const ROW_REGEX=/^[0-5]$/,COLUMN_REGEX=/^[0-6]$/,getDateByPosition=(year,month,row,column)=>{throwIfInvalidRowColumn(row,column);const firstDateOfMonth=new Date(year,month,1);return new Date(firstDateOfMonth.getTime()+_constants_calendar__WEBPACK_IMPORTED_MODULE_0__.s2*(7*row+column-firstDateOfMonth.getDay()))},throwIfInvalidRowColumn=(row,column)=>{if(!ROW_REGEX.test(row.toString())||!COLUMN_REGEX.test(column.toString()))throw Error("잘못된 행 또는 열이 대입되었습니다. 입력 데이터가 아래의 조건을 지키는 지 확인해 주세요:\n- 행은 0 이상 5 이하의 정수여야 합니다.\n- 열은 0 이상 6 이하의 정수여야 합니다.")}},"./src/utils/parseDate.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{s:()=>parseDate});const parseDate=rawDate=>({year:rawDate.getFullYear(),month:rawDate.getMonth(),date:rawDate.getDate(),day:rawDate.getDay()})}}]);
//# sourceMappingURL=components-team_calendar-TeamCalendar-TeamCalendar-stories.1529af0d.iframe.bundle.js.map