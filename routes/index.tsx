import TemplateWrapper from "../islands/TemplateWrapper.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto h-full">
      <div class="h-full mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.png"
          width="128"
          height="128"
          alt="the School Bud-E logo: a baby lion with a graduation cap"
        />
        <TemplateWrapper />
      </div>
    </div>
  );
}
