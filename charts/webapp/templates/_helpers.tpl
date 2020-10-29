{{- define "cluster_name" -}}
{{- $matches := split "." ( .Values.spec.destination.server | toString ) -}}
{{- $matches._1 -}}
{{- end -}}

{{- define "registry_dns" -}}
{{- $match | pritnf "quay.apps" -}}
{{- end -}}

{{- define "cluster_fqdn" -}}
{{- $match := .Values.spec.destination.server | toString | regexFind "api.*:" -}}
{{- $match | trimAll ":" | trimAll "api." -}}
{{- end -}}


{{- define "edge_registry" -}}
{{- printf "quay.apps.%s" .cluster_fqdn }}
{{- end -}}
