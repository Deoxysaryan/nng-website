import { enquiryTopics, topicGroups } from "@/content/site";

/** The enquiry options, grouped: where to begin, an area of life, a service. */
export function TopicOptions() {
  return (
    <>
      {topicGroups.map((group) => (
        <optgroup key={group} label={group}>
          {enquiryTopics
            .filter((topic) => topic.group === group)
            .map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
        </optgroup>
      ))}
    </>
  );
}
