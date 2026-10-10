export interface FlightStop {
  href: string;
  years: string;
  label: string;
}

export class LmFlightPlan extends HTMLElement {
  private built = false;

  connectedCallback(): void {
    this.render();
  }

  set stops(value: FlightStop[]) {
    this.render(value);
  }

  private stopsFromAttr(): FlightStop[] | null {
    const fromAttr = this.getAttribute('stops');
    if (!fromAttr) return null;
    try {
      const parsed = JSON.parse(fromAttr) as FlightStop[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private stopsFromChildren(): FlightStop[] {
    return [...this.querySelectorAll<HTMLAnchorElement>(':scope > a')].map(
      (a) => {
        const years =
          a.querySelector('.lm-yr')?.textContent ?? a.dataset.years ?? '';
        const named = a.querySelector('.lm-name')?.textContent;
        const label = named ?? (a.textContent ?? '').replace(years, '').trim();
        return {
          href: a.getAttribute('href') ?? '#',
          years,
          label,
        };
      },
    );
  }

  private render(stops?: FlightStop[]): void {
    const data: FlightStop[] =
      stops ?? this.stopsFromAttr() ?? this.stopsFromChildren();
    if (!data.length && this.built) return;
    this.replaceChildren();
    const ol = document.createElement('ol');
    for (const stop of data) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = stop.href;
      a.className = 'lm-plan-jump';
      const years = document.createElement('span');
      years.className = 'lm-yr';
      years.textContent = stop.years;
      const name = document.createElement('span');
      name.className = 'lm-name';
      name.textContent = stop.label;
      a.append(years, name);
      li.append(a);
      ol.append(li);
    }
    this.append(ol);
    this.built = true;
  }
}

export function defineLmFlightPlan(): void {
  if (!customElements.get('lm-flight-plan'))
    customElements.define('lm-flight-plan', LmFlightPlan);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-flight-plan': LmFlightPlan;
  }
}
