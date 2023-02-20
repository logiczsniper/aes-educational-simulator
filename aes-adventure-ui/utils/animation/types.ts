import { AnimeInstance, AnimeTimelineInstance } from "animejs";

interface AesAnimatable {
  id: string;
  el: HTMLElement;
  animeInstance: AnimeInstance;
}

type AesAnimationFunction = (timelineInstance: AnimeTimelineInstance) => void;