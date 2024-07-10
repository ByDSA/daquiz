import { Types } from "mongoose";

export function getRemovedIdsFromPulledAttribute(pulledAttribute?: Types.ObjectId|{$in: Types.ObjectId[]}): string[] {
  const ret: string[] = [];
  if (!pulledAttribute)
    return ret;

  if (typeof pulledAttribute === "object" && "$in" in pulledAttribute) {
    const objIds = pulledAttribute.$in.map(String);
    ret.push(...objIds);
  } else {
    ret.push(pulledAttribute.toString());
  }

  return ret;
}