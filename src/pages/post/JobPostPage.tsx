import React from "react";
import JobTypeSelector from "../../components/jobPost/JobTypeSelector";
import JobTitleAndTags from "../../components/jobPost/JobTitleAndTags";
import JobPeriodSelector from "../../components/jobPost/JobPeriodSelector";
import JobWeekdaysSelector from "../../components/jobPost/JobWeekdaysSelector";
import JobTimeSelector from "../../components/jobPost/JobTimeSelector";
import SalaryInput from "../../components/jobPost/SalaryInput";
import RecruitInfo from "../../components/jobPost/RecruitInfo";
import JobDescription from "../../components/jobPost/JobDescription";
import CompanyInfo from "../../components/jobPost/CompanyInfo";
// import JobPostSubmitButton from "../../components/jobPost/JobPostSubmitButton";

import Divider from "../../components/common/Devider";
import CommonButton from "../../components/common/CommonButton";

const JobPostForm = () => {
  return (
    <div className="max-w-[375px] mx-auto px-4 py-8">
      <div className="-mx-4 px-4 w-full flex items-center justify-between h-14 border-b border-[#DEDEDE] relative pb-5">
        <button className="text-[20px]">✕</button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[18px] font-bold font-pretendard">
          일자리 등록
        </h1>
      </div>

      <div className="flex flex-col gap-6 !mx-4">
        {/* 1. 기업/개인 선택 */}
        <JobTypeSelector />
        <Divider />

        {/* 2. 업무 제목 + 태그 선택 */}
        <JobTitleAndTags />
        <Divider />

        {/* 3. 일하는 기간 */}
        <JobPeriodSelector />

        {/* 4. 요일 선택 */}
        <JobWeekdaysSelector />

        {/* 5. 일하는 시간 */}
        <JobTimeSelector />
        <Divider />

        {/* 6. 급여 작성 */}
        <SalaryInput />
        <Divider />

        {/* 7. 모집 마감일, 인원, 우대사항 */}
        <RecruitInfo />
        <Divider />

        {/* 8. 일 설명 + 사진 등록 */}
        <JobDescription />
        <Divider />

        {/* 9. 업체명 + 장소 */}
        <CompanyInfo />

        {/* 10. 다음 버튼 */}
        <CommonButton label={"다음"} />
      </div>
    </div>
  );
};

export default JobPostForm;
